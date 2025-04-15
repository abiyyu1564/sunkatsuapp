import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/chat_message.dart';
import '../utils/websocket_service.dart';
import '../widgets/user_list_tile.dart';
import '../widgets/message_bubble.dart';
import '../utils/constants.dart';

class ChatPage extends StatefulWidget {
  final String userId;

  const ChatPage({required this.userId, Key? key}) : super(key: key);

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController controller = TextEditingController();
  List<ChatMessage> messages = [];
  List<Map<String, dynamic>> onlineUsers = [];
  String? selectedUserId;
  String? username;
  String? selectedUsername;
  late WebSocketService webSocketService;
  Timer? _messagePollingTimer;
  Timer? _userPollingTimer;
  bool isSidebarVisible = false;

  @override
  void initState() {
    super.initState();
    _loadUserDetails();
    _initWebSocket();
    _pollUsers();
  }

  Future<void> _loadUserDetails() async {
    final url = Uri.parse('http://10.0.2.2:8080/api/users/${widget.userId}');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        setState(() {
          username = body['username'];
        });
      }
    } catch (e) {
      print('Failed to load user info: $e');
    }
  }

  void _initWebSocket() {
    webSocketService = WebSocketService(
      userId: widget.userId,
      onMessageReceived: (data) {
        if (selectedUserId == data['senderId']) {
          setState(() {
            messages.add(ChatMessage.fromJson(data));
          });
        }
      },
    );
    webSocketService.connect();
  }

  void _pollUsers() {
    _fetchOnlineUsers();
    _userPollingTimer = Timer.periodic(
      const Duration(seconds: 5),
          (_) => _fetchOnlineUsers(),
    );
  }

  void _startPollingMessages() {
    _loadChatHistory();
    _messagePollingTimer?.cancel();
    _messagePollingTimer = Timer.periodic(
      const Duration(seconds: 1),
          (_) => _loadChatHistory(),
    );
  }

  Future<void> _fetchOnlineUsers() async {
    final url = Uri.parse('http://10.0.2.2:8080/api/users/status/${widget.userId}');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final List<dynamic> users = jsonDecode(response.body);
        setState(() {
          onlineUsers = List<Map<String, dynamic>>.from(users);
        });
      }
    } catch (e) {
      print('Error fetching online users: $e');
    }
  }

  Future<void> _loadChatHistory() async {
    if (selectedUserId == null) return;

    final url = Uri.parse('http://10.0.2.2:8080/messages/${widget.userId}/$selectedUserId');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final List<ChatMessage> loadedMessages = data.map((json) {
          return ChatMessage(
            id: json['id'] ?? '',
            chatId: json['chatId'] ?? '',
            senderId: json['senderId'],
            recipientId: json['recipientId'],
            content: json['content'],
            senderType: json['senderType'] ?? 'user',
            timestamp: (json['timestamp'] != null)
                ? DateTime.tryParse(json['timestamp'])?.toIso8601String() ?? DateTime.now().toIso8601String()
                : DateTime.now().toIso8601String(),
          );
        }).toList();
        setState(() {
          messages = loadedMessages;
        });
      } else {
        print('Failed to load chat history: ${response.statusCode}');
      }
    } catch (e) {
      print('Error loading chat history: $e');
    }
  }

  void _sendMessage() {
    final content = controller.text.trim();
    if (selectedUserId == null || content.isEmpty) return;

    final message = {
      "senderId": widget.userId,
      "recipientId": selectedUserId,
      "content": content,
      "senderType": "user"
    };

    webSocketService.sendMessage(message);
    controller.clear();

    setState(() {
      messages.add(ChatMessage(
        senderId: widget.userId,
        recipientId: selectedUserId!,
        content: content,
        chatId: '',
        timestamp: DateTime.now().toIso8601String(),
        senderType: 'user',
        id: '',
      ));
    });
  }

  void _selectUser(String userId) async {
    setState(() {
      selectedUserId = userId;
      messages = [];
    });

    final url = Uri.parse('http://10.0.2.2:8080/api/users/$userId');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final user = jsonDecode(response.body);
        setState(() {
          selectedUsername = user['username'];
        });
      }
    } catch (e) {
      print('Error fetching user data for $userId: $e');
    }

    _startPollingMessages();
    _toggleSidebar(); // Auto close sidebar when user selected
  }

  void _toggleSidebar() {
    setState(() {
      isSidebarVisible = !isSidebarVisible;
    });
  }

  @override
  void dispose() {
    _messagePollingTimer?.cancel();
    _userPollingTimer?.cancel();
    webSocketService.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Main chat content
          Column(
            children: [
              // Header
              Container(
                color: AppColors.white,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                child: Row(
                  children: [
                    IconButton(
                      icon: const Icon(Icons.menu),
                      onPressed: _toggleSidebar,
                    ),
                    const SizedBox(width: 8),
                    if (selectedUsername != null)
                      CircleAvatar(
                        backgroundColor: AppColors.red.withOpacity(0.1),
                        child: Text(
                          selectedUsername!.isNotEmpty ? selectedUsername![0].toUpperCase() : '?',
                          style: const TextStyle(color: AppColors.red, fontWeight: FontWeight.bold),
                        ),
                      ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            selectedUsername ?? 'Select a user',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            overflow: TextOverflow.ellipsis,
                          ),
                          if (selectedUsername != null)
                            const Text('Online', style: TextStyle(color: Colors.green, fontSize: 12)),
                        ],
                      ),
                    ),
                    if (username != null)
                      Text(
                        'Logged in as $username',
                        style: const TextStyle(
                          fontSize: 12,
                          fontStyle: FontStyle.italic,
                          color: Colors.black54,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                  ],
                ),
              ),

              // Chat area
              Expanded(
                child: Container(
                  color: AppColors.grey.withOpacity(0.2),
                  child: selectedUserId == null
                      ? Center(
                    child: Text('Select a user to start chatting',
                        style: TextStyle(color: Colors.black.withOpacity(0.5))),
                  )
                      : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: messages.length,
                    itemBuilder: (_, index) {
                      final msg = messages[index];
                      final isSender = msg.senderId == widget.userId;
                      return MessageBubble(content: msg.content, isSender: isSender);
                    },
                  ),
                ),
              ),

              // Message input
              Container(
                padding: const EdgeInsets.all(12),
                color: AppColors.white,
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: controller,
                        decoration: InputDecoration(
                          hintText: 'Type a message...',
                          fillColor: AppColors.grey.withOpacity(0.2),
                          filled: true,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(24),
                            borderSide: BorderSide.none,
                          ),
                        ),
                        onSubmitted: (_) => _sendMessage(),
                      ),
                    ),
                    const SizedBox(width: 8),
                    CircleAvatar(
                      backgroundColor: AppColors.red,
                      child: IconButton(
                        icon: const Icon(Icons.send, color: Colors.white),
                        onPressed: _sendMessage,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Sidebar overlay
          if (isSidebarVisible)
            Positioned.fill(
              child: GestureDetector(
                onTap: _toggleSidebar,
                child: Container(color: Colors.black.withOpacity(0.4)),
              ),
            ),
          if (isSidebarVisible)
            Positioned(
              left: 0,
              top: 0,
              bottom: 0,
              width: 250,
              child: Container(
                color: AppColors.black,
                child: Column(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(16),
                      color: AppColors.red,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Online Users', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                          IconButton(
                            icon: const Icon(Icons.close, color: Colors.white),
                            onPressed: _toggleSidebar,
                          )
                        ],
                      ),
                    ),
                    Expanded(
                      child: ListView.builder(
                        padding: const EdgeInsets.all(8),
                        itemCount: onlineUsers.length,
                        itemBuilder: (_, index) {
                          final user = onlineUsers[index];
                          return UserListTile(
                            userId: user['id'],
                            username: user['username'],
                            selectedUserId: selectedUserId,
                            onTap: () => _selectUser(user['id']),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

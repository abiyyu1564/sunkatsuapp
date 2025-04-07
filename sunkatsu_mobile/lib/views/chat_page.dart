import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

import '../models/chat_message.dart';
import '../utils/websocket_service.dart';
import '../widgets/user_list_tile.dart';
import '../widgets/message_bubble.dart';

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
  late WebSocketService webSocketService;
  Timer? _messagePollingTimer;
  Timer? _userPollingTimer;

  @override
  void initState() {
    super.initState();
    _initWebSocket();
    _pollUsers();
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
    _fetchOnlineUsers(); // Initial
    _userPollingTimer = Timer.periodic(
      const Duration(seconds: 5),
          (_) => _fetchOnlineUsers(),
    );
  }

  void _startPollingMessages() {
    _loadChatHistory(); // Initial
    _messagePollingTimer?.cancel(); // Stop previous if exists
    _messagePollingTimer = Timer.periodic(
      const Duration(seconds: 1),
          (_) => _loadChatHistory(),
    );
  }

  Future<void> _fetchOnlineUsers() async {
    final url = Uri.parse('http://localhost:8080/api/users/status/${widget.userId}');
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

  void _loadChatHistory() async {
    if (selectedUserId == null) return;

    final url = Uri.parse('http://localhost:8080/messages/${widget.userId}/$selectedUserId');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final List<ChatMessage> loadedMessages =
        data.map((json) => ChatMessage.fromJson(json)).toList();
        setState(() {
          messages = loadedMessages;
        });
      }
    } catch (e) {
      print('Error loading chat history: $e');
    }
  }

  void _sendMessage() {
    if (selectedUserId == null || controller.text.trim().isEmpty) return;

    final message = {
      "senderId": widget.userId,
      "recipientId": selectedUserId,
      "content": controller.text.trim(),
      "senderType": "user"
    };

    webSocketService.sendMessage(message);
    controller.clear();
  }

  void _selectUser(String userId) {
    setState(() {
      selectedUserId = userId;
      messages = [];
    });
    _startPollingMessages();
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
      body: Row(
        children: [
          // Online users sidebar
          Container(
            width: 250,
            color: Colors.red.shade900,
            padding: const EdgeInsets.all(8),
            child: Column(
              children: [
                const Text(
                  'Online Users',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                Expanded(
                  child: ListView.builder(
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

          // Chat area
          Expanded(
            child: Column(
              children: [
                if (selectedUserId == null)
                  const Expanded(
                    child: Center(child: Text('Select a user to start chatting')),
                  )
                else
                  Expanded(
                    child: ListView.builder(
                      itemCount: messages.length,
                      itemBuilder: (_, index) {
                        final msg = messages[index];
                        final isSender = msg.senderId == widget.userId;
                        return MessageBubble(content: msg.content, isSender: isSender);
                      },
                    ),
                  ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      Expanded(child: TextField(controller: controller)),
                      IconButton(
                        icon: const Icon(Icons.send),
                        onPressed: _sendMessage,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

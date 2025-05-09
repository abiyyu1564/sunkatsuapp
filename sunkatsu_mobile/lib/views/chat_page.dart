import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import '../models/chat_message.dart';
import '../utils/constants.dart';
import '../utils/jwt_utils.dart';
import '../utils/websocket_service.dart';
import '../widgets/message_bubble.dart';
import '../widgets/user_list_tile.dart';

final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
FlutterLocalNotificationsPlugin();

class ChatPage extends StatefulWidget {
  final String userId;

  const ChatPage({required this.userId, Key? key}) : super(key: key);

  @override
  State<ChatPage> createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final TextEditingController controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();

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
    _initializeNotifications();
    _loadUserDetails();
    _initWebSocket();
    _pollUsers();
  }

  Future<void> _deleteMessage(ChatMessage message) async {
    // Show confirmation dialog
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Message'),
        content: const Text('Are you sure you want to delete this message?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    try {
      // Get the JWT token
      final token = await JwtUtils.getToken();

      final url = Uri.parse('http://localhost:8080/messages/${message.id}');
      final response = await http.delete(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        setState(() {
          messages.removeWhere((msg) => msg.id == message.id);
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Message deleted')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to delete message')),
        );
      }
    } catch (e) {
      print('Error deleting message: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error deleting message')),
      );
    }
  }

  Future<void> _editMessage(ChatMessage message) async {
    final TextEditingController editController = TextEditingController(text: message.content);

    final newContent = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Edit Message'),
        content: TextField(
          controller: editController,
          decoration: const InputDecoration(
            hintText: 'Edit your message',
            border: OutlineInputBorder(),
          ),
          maxLines: 3,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, editController.text),
            child: const Text('Save', style: TextStyle(color: AppColors.red)),
          ),
        ],
      ),
    );

    if (newContent == null || newContent.isEmpty || newContent == message.content) return;

    try {
      // Get the JWT token
      final token = await JwtUtils.getToken();

      final url = Uri.parse('http://localhost:8080/messages/${message.id}');
      final response = await http.put(
        url,
        headers: {
          'Content-Type': 'text/plain', // Set content type to plain text
          'Authorization': 'Bearer $token',
        },
        body: newContent, // Send the content as plain text
      );

      if (response.statusCode == 200) {
        setState(() {
          final index = messages.indexWhere((msg) => msg.id == message.id);
          if (index != -1) {
            messages[index] = ChatMessage(
              id: message.id,
              chatId: message.chatId,
              senderId: message.senderId,
              recipientId: message.recipientId,
              content: newContent,
              imageUrl: message.imageUrl,
              senderType: message.senderType,
              timestamp: message.timestamp,
            );
          }
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Message updated')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to update message')),
        );
      }
    } catch (e) {
      print('Error updating message: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error updating message')),
      );
    }
  }

  Future<void> _loadUserDetails() async {
    final url = Uri.parse('http://localhost:8080/api/users/${widget.userId}');
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

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  Future<void> _initializeNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
    AndroidInitializationSettings('@mipmap/ic_launcher');

    final InitializationSettings initializationSettings =
    InitializationSettings(android: initializationSettingsAndroid);

    await flutterLocalNotificationsPlugin.initialize(initializationSettings);
  }

  Future<void> _showSystemNotification(ChatMessage message) async {
    final senderName =
    onlineUsers.firstWhere(
          (user) => user['id'] == message.senderId,
      orElse: () => {'username': 'Someone'},
    )['username'];

    const AndroidNotificationDetails androidDetails =
    AndroidNotificationDetails(
      'chat_channel', // channel id
      'Chat Messages', // channel name
      channelDescription: 'Notification for chat messages',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: true,
    );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
    );

    await flutterLocalNotificationsPlugin.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000, // id
      '$senderName sent a message',
      message.content?.isNotEmpty == true ? message.content : '[Image]',
      platformDetails,
    );
  }

  void _initWebSocket() {
    webSocketService = WebSocketService(
      userId: widget.userId,
      onMessageReceived: (data) {
        final incomingMessage = ChatMessage.fromJson(data);

        if (selectedUserId == incomingMessage.senderId) {
          setState(() {
            messages.add(incomingMessage);
          });
          WidgetsBinding.instance.addPostFrameCallback(
                (_) => _scrollToBottom(),
          );
        } else {
          _showInAppNotification(incomingMessage);
          _showSystemNotification(incomingMessage);
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
    final url = Uri.parse(
      'http://localhost:8080/api/users/status/${widget.userId}',
    );
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

  void _showInAppNotification(ChatMessage message) {
    final senderName =
    onlineUsers.firstWhere(
          (user) => user['id'] == message.senderId,
      orElse: () => {'username': 'Someone'},
    )['username'];

    final snackBar = SnackBar(
      content: Text('$senderName sent you a message'),
      action: SnackBarAction(
        label: 'Open',
        onPressed: () {
          _selectUser(message.senderId);
        },
      ),
      duration: const Duration(seconds: 5),
      backgroundColor: Colors.grey[900],
      behavior: SnackBarBehavior.floating,
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  Future<void> _loadChatHistory() async {
    if (selectedUserId == null) return;

    final url = Uri.parse(
      'http://localhost:8080/messages/${widget.userId}/$selectedUserId',
    );
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        print("Data: $data");
        final List<ChatMessage> loadedMessages =
        data.map((json) {
          return ChatMessage(
            id: json['id'] ?? '',
            chatId: json['chatId'] ?? '',
            senderId: json['senderId'],
            recipientId: json['recipientId'],
            content: json['content'],
            imageUrl: json['imageUrl'],
            senderType: json['senderType'] ?? 'user',
            timestamp:
            (json['timestamp'] != null)
                ? DateTime.tryParse(
              json['timestamp'],
            )?.toIso8601String() ??
                DateTime.now().toIso8601String()
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

  Future<void> _sendMessage({String? imageUrl}) async {
    final content = controller.text.trim();
    if (selectedUserId == null || (content.isEmpty && imageUrl == null)) return;

    final message = {
      "senderId": widget.userId,
      "recipientId": selectedUserId,
      "content": content.isEmpty ? null : content,
      "imageUrl": imageUrl,
      "senderType": "user",
      "timestamp": DateTime.now().toIso8601String(),
    };

    webSocketService.sendMessage(message);
    controller.clear();

    setState(() {
      messages.add(
        ChatMessage(
          senderId: widget.userId,
          recipientId: selectedUserId!,
          content: content,
          imageUrl: imageUrl,
          chatId: '',
          timestamp: DateTime.now().toIso8601String(),
          senderType: 'user',
          id: '',
        ),
      );
    });
    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
  }

  Future<void> _pickAndSendImage() async {
    showModalBottomSheet(
      context: context,
      builder: (_) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('Take a photo'),
                onTap: () async {
                  Navigator.pop(context);
                  await _pickImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Choose from gallery'),
                onTap: () async {
                  Navigator.pop(context);
                  await _pickImage(ImageSource.gallery);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: source);
    if (pickedFile == null) return;

    final token = await JwtUtils.getToken();
    final uri = Uri.parse("http://localhost:8080/api/files/upload");

    final request =
    http.MultipartRequest("POST", uri)
      ..headers['Authorization'] = 'Bearer $token'
      ..files.add(
        await http.MultipartFile.fromPath('file', pickedFile.path),
      );

    final response = await request.send();

    if (response.statusCode == 200) {
      final imageUrl = await response.stream.bytesToString();
      await _sendMessage(imageUrl: imageUrl);
    } else {
      print("Image upload failed: ${response.statusCode}");
    }
  }

  void _selectUser(String userId) async {
    setState(() {
      selectedUserId = userId;
      messages = [];
    });

    final url = Uri.parse('http://localhost:8080/api/users/$userId');
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
      backgroundColor: AppColors.whiteBG,
      body: SafeArea(
        child: Stack(
          children: [
            // Main chat content
            Column(
              children: [
                Container(
                  color: AppColors.whiteBG,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                      ),
                      // Keep your MENU (sidebar) button untouched
                      const SizedBox(width: 8),
                      if (selectedUsername != null)
                        CircleAvatar(
                          backgroundColor: AppColors.red.withOpacity(0.1),
                          child: Text(
                            selectedUsername!.isNotEmpty
                                ? selectedUsername![0].toUpperCase()
                                : '?',
                            style: const TextStyle(
                              color: AppColors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            GestureDetector(
                              onTap: _toggleSidebar,
                              child: Text(
                                selectedUsername ?? 'Select a user',
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            if (selectedUsername != null)
                              const Text(
                                'Online',
                                style: TextStyle(
                                  color: Colors.green,
                                  fontSize: 12,
                                ),
                              ),
                            /* Unused Icon Button
                            IconButton(
                              icon: const Icon(Icons.menu),
                              onPressed: _toggleSidebar,
                            ),
                             */
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

                Expanded(
                  child: Container(
                    color: AppColors.grey.withAlpha(80),
                    child:
                    selectedUserId == null
                        ? Center(
                      child: Text(
                        'Select a user to start chatting',
                        style: TextStyle(
                          color: Colors.black.withAlpha(80),
                        ),
                      ),
                    )
                        : ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: messages.length,
                      itemBuilder: (_, index) {
                        final msg = messages[index];
                        final isSender = msg.senderId == widget.userId;
                        return MessageBubble(
                          content: msg.content,
                          isSender: isSender,
                          imageUrl: msg.imageUrl,
                          onDelete: isSender ? (content) => _deleteMessage(msg) : null,
                          onEdit: isSender ? (content) => _editMessage(msg) : null,
                        );
                      },
                    ),
                  ),
                ),

                Container(
                  padding: const EdgeInsets.all(12),
                  color: AppColors.white,
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.image),
                        onPressed: _pickAndSendImage,
                      ),
                      Expanded(
                        child: TextField(
                          controller: controller,
                          decoration: InputDecoration(
                            hintText: 'Type a message...',
                            fillColor: AppColors.black.withAlpha(10),
                            filled: true,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 12,
                            ),
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
                          onPressed: () => _sendMessage(),
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
                  color: AppColors.white,
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        color: AppColors.red,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Online Users',
                              style: TextStyle(
                                color: AppColors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            IconButton(
                              icon: const Icon(
                                Icons.close,
                                color: AppColors.white,
                              ),
                              onPressed: _toggleSidebar,
                            ),
                          ],
                        ),
                      ),
                      ListTile(
                        leading: const Icon(
                          Icons.arrow_back,
                          color: AppColors.black,
                        ),
                        title: const Text(
                          'Back to Home',
                          style: TextStyle(color: AppColors.black),
                        ),
                        onTap: () {
                          Navigator.pop(context);
                        },
                        tileColor: AppColors.black, // match sidebar background
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
      ),
    );
  }
}
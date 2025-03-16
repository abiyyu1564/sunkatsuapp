import 'package:flutter/material.dart';
import '../models/user.dart';
import '../widgets/online_users.dart';
import '../widgets/chat_bubble.dart';
import '../widgets/chat_input.dart';

class ChatPage extends StatelessWidget {
  const ChatPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chat')),
      body: Row(
        children: [
          OnlineUsers(users: [], onUserSelected: (userId) {}),
          Expanded(
            child: Column(
              children: [
                Expanded(child: ListView()),
                ChatInput(onSendMessage: (message) {}),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

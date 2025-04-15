import 'package:flutter/material.dart';

typedef OnSendMessage = void Function(String message);

class ChatInput extends StatefulWidget {
  final OnSendMessage onSendMessage;

  const ChatInput({required this.onSendMessage, super.key});

  @override
  _ChatInputState createState() => _ChatInputState();
}

class _ChatInputState extends State<ChatInput> {
  final TextEditingController _controller = TextEditingController();

  void _send() {
    if (_controller.text.isNotEmpty) {
      widget.onSendMessage(_controller.text);
      _controller.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _controller,
            decoration: const InputDecoration(hintText: 'Type a message...'),
          ),
        ),
        IconButton(icon: const Icon(Icons.send), onPressed: _send),
      ],
    );
  }
}
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../models/chatbot_message.dart';
import '../utils/constants.dart';
import '../widgets/chat_bubble.dart';

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage> {
  final List<ChatMessage> _messages = [];
  final TextEditingController _controller = TextEditingController();
  bool _isLoading = false;

  Future<void> _sendMessage(String message) async {
    if (message.trim().isEmpty) return;

    setState(() {
      _messages.add(ChatMessage(text: message, sender: MessageSender.user));
      _isLoading = true;
    });
    _controller.clear();

    final uri = Uri.parse('http://localhost:8080/stream?message=$message');
    final request = http.Request('GET', uri);
    final streamedResponse = await request.send();

    StringBuffer buffer = StringBuffer();
    streamedResponse.stream
        .transform(utf8.decoder)
        .listen(
          (chunk) {
            buffer.write(chunk);
            setState(() {
              if (_messages.isNotEmpty &&
                  _messages.last.sender == MessageSender.bot) {
                _messages[_messages.length - 1] = ChatMessage(
                  text: buffer.toString(),
                  sender: MessageSender.bot,
                );
              } else {
                _messages.add(
                  ChatMessage(text: chunk, sender: MessageSender.bot),
                );
              }
            });
          },
          onDone: () {
            setState(() {
              _isLoading = false;
            });
          },
          onError: (_) {
            setState(() {
              _messages.add(
                ChatMessage(
                  text: "Maaf, terjadi kesalahan saat menghubungi server.",
                  sender: MessageSender.bot,
                ),
              );
              _isLoading = false;
            });
          },
        );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteBG,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: AppColors.red,
        title: const Text(
          "Sunkatsu Assistant",
          style: TextStyle(color: AppColors.white),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                reverse: true,
                padding: const EdgeInsets.only(bottom: 12, top: 8),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final reversedIndex = _messages.length - 1 - index;
                  return ChatBubble(message: _messages[reversedIndex]);
                },
              ),
            ),
            Divider(height: 1, color: AppColors.grey),
            SizedBox(height: 6),
            _buildInputArea(),
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea() {
    return SafeArea(
      child: Container(
        color: AppColors.whiteBG,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(
          children: [
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: AppColors.grey,
                    width: 1,
                  )
                ),
                child: Center(
                  child: TextField(
                    controller: _controller,
                    onSubmitted: _sendMessage,
                    decoration: const InputDecoration(
                      hintText: "Tanya sesuatu...",
                      border: InputBorder.none,
                    ),
                    textInputAction: TextInputAction.send,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            ClipOval(
              child: Material(
                color: AppColors.red,
                child: InkWell(
                  onTap: () => _sendMessage(_controller.text),
                  child: const Padding(
                    padding: EdgeInsets.all(12),
                    child: Icon(Icons.send, color: AppColors.white),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

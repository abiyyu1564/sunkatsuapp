import 'package:flutter/material.dart';
import '../utils/constants.dart';

class MessageBubble extends StatelessWidget {
  final String content;
  final bool isSender;

  const MessageBubble({
    required this.content,
    required this.isSender,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: isSender ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!isSender)
            const CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.black,
              child: Icon(Icons.person, size: 16, color: AppColors.white),
            ),
          if (!isSender) const SizedBox(width: 8),

          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: BoxDecoration(
                color: isSender ? AppColors.red : AppColors.white,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft: Radius.circular(isSender ? 16 : 4),
                  bottomRight: Radius.circular(isSender ? 4 : 16),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Text(
                content,
                style: TextStyle(
                  color: isSender ? AppColors.white : AppColors.black,
                ),
              ),
            ),
          ),

          if (isSender) const SizedBox(width: 8),
          if (isSender)
            const CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.red,
              child: Icon(Icons.person, size: 16, color: AppColors.white),
            ),
        ],
      ),
    );
  }
}

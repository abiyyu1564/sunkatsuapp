import 'package:flutter/material.dart';
import '../utils/constants.dart';
import 'image_loader.dart'; // add this import

class MessageBubble extends StatelessWidget {
  final String? content;
  final String? imageUrl;
  final bool isSender;

  const MessageBubble({
    required this.content,
    required this.isSender,
    this.imageUrl,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bubbleColor = isSender ? AppColors.red : AppColors.white;
    final textColor = isSender ? AppColors.white : AppColors.black;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment:
        isSender ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
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
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: bubbleColor,
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (content != null && content!.isNotEmpty)
                    Text(
                      content!,
                      style: TextStyle(color: textColor),
                    ),
                  if (imageUrl != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 8),
                      child: SecureImageLoader(imageUrl: imageUrl!),
                    ),
                ],
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

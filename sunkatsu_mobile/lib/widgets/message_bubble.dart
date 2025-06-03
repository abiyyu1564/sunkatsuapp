import 'package:flutter/material.dart';
import '../utils/constants.dart';
import 'image_loader.dart';

class MessageBubble extends StatefulWidget {
  final String? content;
  final String? imageUrl;
  final bool isSender;
  final Function(String?)? onDelete;
  final Function(String?)? onEdit;

  const MessageBubble({
    required this.content,
    required this.isSender,
    this.imageUrl,
    this.onDelete,
    this.onEdit,
    Key? key,
  }) : super(key: key);

  @override
  State<MessageBubble> createState() => _MessageBubbleState();
}

class _MessageBubbleState extends State<MessageBubble> {
  void _showOptionsBottomSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Wrap(
            children: <Widget>[
              ListTile(
                leading: const Icon(Icons.edit, color: AppColors.red),
                title: const Text('Edit Message'),
                onTap: () {
                  Navigator.pop(context);
                  if (widget.onEdit != null) {
                    widget.onEdit!(widget.content);
                  }
                },
              ),
              ListTile(
                leading: const Icon(Icons.delete, color: AppColors.red),
                title: const Text('Delete Message'),
                onTap: () {
                  Navigator.pop(context);
                  if (widget.onDelete != null) {
                    widget.onDelete!(widget.content);
                  }
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final bubbleColor = widget.isSender ? AppColors.red : AppColors.white;
    final textColor = widget.isSender ? AppColors.white : AppColors.black;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment:
        widget.isSender ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!widget.isSender)
            const CircleAvatar(
              radius: 16,
              backgroundColor: AppColors.black,
              child: Icon(Icons.person, size: 16, color: AppColors.white),
            ),
          if (!widget.isSender) const SizedBox(width: 8),
          Flexible(
            child: GestureDetector(
              onLongPress: () {
                // Edit or delete message jika mesg sendiri
                if (widget.isSender) {
                  _showOptionsBottomSheet(context);
                }
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: bubbleColor,
                  borderRadius: BorderRadius.only(
                    topLeft: const Radius.circular(16),
                    topRight: const Radius.circular(16),
                    bottomLeft: Radius.circular(widget.isSender ? 16 : 4),
                    bottomRight: Radius.circular(widget.isSender ? 4 : 16),
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
                    if (widget.content != null && widget.content!.isNotEmpty)
                      Text(
                        widget.content!,
                        style: TextStyle(color: textColor),
                      ),
                    if (widget.imageUrl != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: SecureImageLoader(imageUrl: widget.imageUrl!),
                      ),
                  ],
                ),
              ),
            ),
          ),
          if (widget.isSender) const SizedBox(width: 8),
          if (widget.isSender)
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
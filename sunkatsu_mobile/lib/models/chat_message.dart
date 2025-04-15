class ChatMessage {
  final String id;
  final String chatId;
  final String senderId;
  final String recipientId;
  final String? content;
  final String? imageUrl;
  final String? senderType;
  final String? timestamp;

  ChatMessage({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.recipientId,
    this.content,
    this.imageUrl,
    this.senderType,
    this.timestamp,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id']?.toString() ?? '',
      chatId: json['chatId']?.toString() ?? '',
      senderId: json['senderId']?.toString() ?? '',
      recipientId: json['recipientId']?.toString() ?? '',
      content: json['content']?.toString(),
      imageUrl: json['imageUrl']?.toString(),
      senderType: json['senderType']?.toString(),
      timestamp: json['timestamp'] is String
          ? DateTime.tryParse(json['timestamp'])?.toIso8601String()
          : null,
    );
  }
}

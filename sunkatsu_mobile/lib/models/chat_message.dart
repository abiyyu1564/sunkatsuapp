class ChatMessage {
  final String id;
  final String chatId;
  final String senderId;
  final String recipientId;
  final String content;
  final String timestamp;
  final String senderType;

  ChatMessage({
    required this.id,
    required this.chatId,
    required this.senderId,
    required this.recipientId,
    required this.content,
    required this.timestamp,
    required this.senderType,
  });

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'],
      chatId: json['chatId'],
      senderId: json['senderId'],
      recipientId: json['recipientId'],
      content: json['content'],
      timestamp: json['timestamp'],
      senderType: json['senderType'],
    );
  }
}

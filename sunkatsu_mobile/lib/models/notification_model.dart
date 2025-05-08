class NotificationModel {
  final String id;
  final String message;
  final DateTime timestamp;
  final String status; // "placed", "completed", "processing", etc.
  final String? orderId;

  NotificationModel({
    required this.id,
    required this.message,
    required this.timestamp,
    required this.status,
    this.orderId,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] ?? '',
      message: json['message'] ?? '',
      timestamp:
          json['timestamp'] != null
              ? DateTime.parse(json['timestamp'])
              : DateTime.now(),
      status: json['status'] ?? '',
      orderId: json['orderId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'message': message,
      'timestamp': timestamp.toIso8601String(),
      'status': status,
      'orderId': orderId,
    };
  }
}

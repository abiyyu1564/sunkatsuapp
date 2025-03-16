import 'package:stomp_dart_client/stomp_dart_client.dart';
import 'package:sunkatsu_mobile/models/user.dart';

typedef OnMessageReceived = void Function(String senderId, String content);

typedef OnUserListUpdated = void Function(List<User> users);

class WebSocketService {
  late StompClient stompClient;
  final String userId;
  final OnMessageReceived onMessageReceived;
  final OnUserListUpdated onUserListUpdated;

  WebSocketService({
    required this.userId,
    required this.onMessageReceived,
    required this.onUserListUpdated,
  }) {
    stompClient = StompClient(
      config: StompConfig.sockJS(
        url: 'http://localhost:8080/ws',
        onConnect: onConnected,
        onWebSocketError: (dynamic error) => print('WebSocket Error: \$error'),
      ),
    );
    stompClient.activate();
  }

  void onConnected(StompFrame frame) {
    stompClient.subscribe(
      destination: '/user/\$userId/queue/messages',
      callback: (frame) {
        if (frame.body != null) {
          final message = frame.body!;
          final senderId = "unknown_sender"; // Parse senderId from message
          onMessageReceived(senderId, message);
        }
      },
    );

    stompClient.subscribe(
      destination: '/user/public',
      callback: (frame) {
        if (frame.body != null) {
          // Fetch users list from frame.body
          onUserListUpdated([]); // Dummy empty list for now
        }
      },
    );
  }

  void sendMessage(String recipientId, String content) {
    stompClient.send(
      destination: '/app/chat',
      body: '{"senderId": "\$userId", "recipientId": "\$recipientId", "content": "\$content"}',
    );
  }
}
import 'dart:convert';
import 'package:stomp_dart_client/stomp_dart_client.dart';

class WebSocketService {
  late StompClient stompClient;
  final String userId;
  final Function(Map<String, dynamic>) onMessageReceived;

  WebSocketService({required this.userId, required this.onMessageReceived});

  void connect() {
    stompClient = StompClient(
      config: StompConfig.sockJS(
        url: 'http://localhost:8080/ws',
        onConnect: _onConnect,
        onWebSocketError: (dynamic error) => print('WebSocket Error: $error'),
      ),
    );
    stompClient.activate();
  }

  void _onConnect(StompFrame frame) {
    stompClient.subscribe(
      destination: '/user/queue/messages',
      callback: (frame) {
        if (frame.body != null) {
          onMessageReceived(Map<String, dynamic>.from(jsonDecode(frame.body!)));
        }
      },
    );
  }

  void sendMessage(Map<String, dynamic> message) {
    stompClient.send(destination: '/app/chat', body: jsonEncode(message));
  }

  void disconnect() {
    stompClient.deactivate();
  }
}

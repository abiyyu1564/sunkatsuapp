// main.dart
import 'package:flutter/material.dart';
import 'views/chat_page.dart';
import 'views/chatbot_page.dart';
import 'views/splash_screen.dart';
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Sunkatsu App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true),
      home: const SplashScreen(),
    );
  }
}

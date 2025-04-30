// main.dart
import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/preview_page.dart';
import 'package:sunkatsu_mobile/views/add_menu.dart';
import 'package:sunkatsu_mobile/views/edit_menu_page.dart';
import 'package:sunkatsu_mobile/views/home_page.dart';
import 'package:sunkatsu_mobile/views/login_page.dart';
import 'package:sunkatsu_mobile/views/order_page.dart';
import 'package:sunkatsu_mobile/views/sign_up_page.dart';
import 'package:sunkatsu_mobile/views/staff_order_page.dart';
import 'package:sunkatsu_mobile/views/welcome_page.dart';

import 'views/chat_page.dart';
import 'views/chatbot_page.dart';
import 'views/splash_screen.dart';
import 'package:sunkatsu_mobile/navigation/main_navigation.dart';
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
      home: MainNavigation(),
    );
  }
}

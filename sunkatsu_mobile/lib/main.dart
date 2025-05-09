import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/navigation/main_navigation.dart';
import 'package:sunkatsu_mobile/preview_page.dart';
import 'package:sunkatsu_mobile/views/add_menu.dart';
import 'package:sunkatsu_mobile/views/edit_menu_page.dart';
import 'package:sunkatsu_mobile/views/home_page.dart';
import 'package:sunkatsu_mobile/views/login_page.dart';
import 'package:sunkatsu_mobile/views/notification_page.dart';
import 'package:sunkatsu_mobile/views/order_page.dart';
import 'package:sunkatsu_mobile/views/sign_up_page.dart';
import 'package:sunkatsu_mobile/views/staff_order_page.dart';
import 'package:sunkatsu_mobile/views/welcome_page.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:awesome_notifications/awesome_notifications.dart';

import 'views/chat_page.dart';
import 'views/chatbot_page.dart';
import 'views/splash_screen.dart';
import 'package:sunkatsu_mobile/navigation/main_navigation.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Inisialisasi notifikasi
  AwesomeNotifications().initialize(
    null, // Use default icon
    [
      NotificationChannel(
        channelKey: 'order_status_channel',
        channelName: 'Order Status',
        channelDescription: 'Notifications for order status changes',
        defaultColor: const Color(0xFF9D50DD),
        ledColor: Colors.white,
        importance: NotificationImportance.High,
      ),
    ],
  );
  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  const AndroidInitializationSettings initializationSettingsAndroid =
      AndroidInitializationSettings('@mipmap/ic_launcher');

  const InitializationSettings initializationSettings = InitializationSettings(
    android: initializationSettingsAndroid,
  );

  AwesomeNotifications().isNotificationAllowed().then((isAllowed) {
    if (!isAllowed) {
      // Request permission to send notifications
      AwesomeNotifications().requestPermissionToSendNotifications();
    }
  });

  await flutterLocalNotificationsPlugin.initialize(initializationSettings);

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
      home: SplashScreen(),
    );
  }
}

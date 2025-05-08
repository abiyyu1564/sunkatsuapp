import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/widgets/order_card.dart';
// Tambahkan import berikut di bagian atas file
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:async';

class OrderPage extends StatefulWidget {
  const OrderPage({super.key});

  @override
  State<OrderPage> createState() => _OrderPageState();
}

class _OrderPageState extends State<OrderPage> {
  String selectedCategory = 'All'; // Filter kategori yang dipilih
  // Tambahkan variabel ini di dalam class _OrderPageState
  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  // Data dummy pesanan tanpa cardColor, yang akan ditentukan berdasarkan status
  final List<Map<String, dynamic>> allOrders = [
    {
      'id': '0',
      'name': 'Rifqy',
      'date': '15 March 2025',
      'status': 'On Going',
      'items': ['1x Chicken Katsu', '1x Ice Tea', '1x Oreo Ice Cream'],
    },
    {
      'id': '1',
      'name': 'Raygama',
      'date': '15 March 2025',
      'status': 'Payment',
      'items': ['1x Chicken Katsu', '1x Ice Tea'],
    },
    {
      'id': '2',
      'name': 'Rangga',
      'date': '3 March 2025',
      'status': 'Finished',
      'items': ['2x Chicken Katsu', '2x Ice Tea'],
    },
    {
      'id': '3',
      'name': 'Melin',
      'date': '3 March 2025',
      'status': 'Payment',
      'items': ['2x Chicken Katsu', '2x Ice Tea'],
    },
  ];

  @override
  void initState() {
    super.initState();
    _initializeNotifications();
  }

  // Tambahkan fungsi ini di dalam class _OrderPageState
  Future<void> _initializeNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const InitializationSettings initializationSettings =
        InitializationSettings(android: initializationSettingsAndroid);

    await flutterLocalNotificationsPlugin.initialize(initializationSettings);
  }

  // Tambahkan fungsi ini di dalam class _OrderPageState
  Future<void> _showNotification(String title, String body) async {
    const AndroidNotificationDetails androidDetails =
        AndroidNotificationDetails(
          'order_status_channel',
          'Order Status',
          channelDescription: 'Notifications for order status changes',
          importance: Importance.high,
          priority: Priority.high,
          showWhen: true,
        );

    const NotificationDetails platformDetails = NotificationDetails(
      android: androidDetails,
    );

    await flutterLocalNotificationsPlugin.show(
      DateTime.now().millisecond,
      title,
      body,
      platformDetails,
    );
  }

  // Tambahkan fungsi ini di dalam class _OrderPageState
  Future<void> _saveNotification(String message, String status) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final notificationsJson = prefs.getString('notifications') ?? '[]';
      final notifications = List<Map<String, dynamic>>.from(
        jsonDecode(notificationsJson),
      );

      notifications.add({
        'message': message,
        'timestamp': DateTime.now().toIso8601String(),
        'status': status,
      });

      await prefs.setString('notifications', jsonEncode(notifications));
    } catch (e) {
      debugPrint('Error saving notification: $e');
    }
  }

  // Filter berdasarkan kategori
  List<Map<String, dynamic>> get filteredOrders {
    if (selectedCategory == 'All') return allOrders;
    return allOrders
        .where((order) => order['status'] == selectedCategory)
        .toList();
  }

  // Membuat tombol kategori filter
  Widget _buildCategoryButton(String label) {
    final bool isSelected = selectedCategory == label;

    return TextButton(
      onPressed: () {
        setState(() {
          selectedCategory = label;
        });
      },
      style: TextButton.styleFrom(
        backgroundColor: isSelected ? AppColors.red : AppColors.grey,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        side: BorderSide(color: AppColors.black.withAlpha(65), width: 0.5),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : Colors.black,
          fontWeight: FontWeight.normal,
        ),
      ),
    );
  }

  // Ubah fungsi _onActionTap dengan kode berikut
  void _onActionTap(int index) {
    setState(() {
      if (allOrders[index]['status'] == 'Payment') {
        allOrders[index]['status'] =
            'On Going'; // Mengubah status pesanan menjadi On Going
      } else if (allOrders[index]['status'] == 'On Going') {
        allOrders[index]['status'] =
            'Finished'; // Mengubah status pesanan menjadi Finished

        // Tambahkan notifikasi saat status berubah menjadi Finished
        final orderName = allOrders[index]['name'];
        final message = 'Pesanan untuk $orderName telah selesai';

        // Simpan notifikasi
        _saveNotification(message, 'completed');

        // Tampilkan notifikasi
        _showNotification('Pesanan Selesai', message);
      }
    });
  }

  // Fungsi untuk memindahkan pesanan yang statusnya 'On Going' ke atas
  void _moveToTop(int index) {
    setState(() {
      if (allOrders[index]['status'] == 'On Going') {
        // Mengambil pesanan dan menambahkannya ke paling atas
        final order = allOrders.removeAt(index);
        allOrders.insert(0, order); // Memindahkan ke atas
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    List<String> categories = ['All', 'Payment', 'On Going', 'Finished'];

    // Urutkan filteredOrders: Pindahkan "On Going" ke paling atas, lalu urutkan berdasarkan 'id'
    final sortedOrders =
        filteredOrders..sort((a, b) {
          if (a['status'] == 'On Going' && b['status'] != 'On Going') return -1;
          if (a['status'] != 'On Going' && b['status'] == 'On Going') return 1;
          return a['id'].compareTo(b['id']);
        });

    return Scaffold(
      backgroundColor: AppColors.whiteBG,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                // Filter kategori
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children:
                      categories
                          .map((category) => _buildCategoryButton(category))
                          .toList(),
                ),
                const SizedBox(height: 20),
                // Menampilkan daftar pesanan yang sudah difilter dan diurutkan
                ...sortedOrders.map((order) {
                  // Tentukan cardColor berdasarkan status
                  Color cardColor;
                  if (order['status'] == 'Payment') {
                    cardColor = AppColors.black;
                  } else if (order['status'] == 'On Going') {
                    cardColor = AppColors.red;
                  } else {
                    cardColor = AppColors.black;
                  }

                  return GestureDetector(
                    onTap: () {
                      if (order['status'] == 'On Going') {
                        // Pindahkan pesanan "On Going" ke atas
                        final index = sortedOrders.indexOf(order);
                        _moveToTop(index); // Pindahkan pesanan ke atas
                      }
                    },
                    child: OrderCard(
                      id: int.parse(order['id']),
                      name: order['name'],
                      date: order['date'],
                      status: order['status'],
                      items: List<String>.from(order['items']),
                      color:
                          cardColor, // Menggunakan color yang terdefinisi berdasarkan status
                      onActionTap:
                          () => _onActionTap(sortedOrders.indexOf(order)),
                      role: 'admin',
                    ),
                  );
                }),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

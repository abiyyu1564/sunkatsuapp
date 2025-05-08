import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sunkatsu_mobile/models/cart_item.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/widgets/order_card.dart';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'package:awesome_notifications/awesome_notifications.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import 'chat_page.dart';

class OrderItem {
  final int? id;
  int total;
  final String deliver;
  final int? userID;
  String status;
  final List<CartItem> cartItems;
  final DateTime? paymentDeadline;

  OrderItem({
    required this.id,
    required this.total,
    required this.deliver,
    required this.userID,
    required this.status,
    required this.cartItems,
    required this.paymentDeadline,
  });

  factory OrderItem.fromJSON(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] ?? 0,
      total: json['total'] ?? 0,
      deliver: json['deliver'] ?? '',
      userID: json['userID'] ?? 0,
      status: json['status'] ?? '',
      cartItems: (json['cartItems'] as List<dynamic>?)
          ?.map((item) => CartItem.fromJson(item))
          .toList() ??
          [],
      paymentDeadline: json['paymentDeadline'] != null
          ? DateTime.parse(json['paymentDeadline'])
          : null,
    );
  }
}

class OrderPage extends StatefulWidget {
  const OrderPage({super.key});

  @override
  State<OrderPage> createState() => _OrderPageState();
}

class _OrderPageState extends State<OrderPage> {
  int _currentIndex = 0;
  String selectedCategory = 'All';
  String? userRole;
  bool _isLoading = true;

  List<OrderItem> orderedItems = [];


  @override
  void initState() {
    super.initState();
    decodeAndSetUserRole();
    fetchOrderItems();
  }

  Future<void> decodeAndSetUserRole() async {
    final token = await JwtUtils.getToken();
    if (token != null) {
      final payload = await JwtUtils.parseJwtPayload();
      setState(() {
        userRole = payload?['role'];
        _isLoading = false;
      });
    } else {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> fetchOrderItems() async {
    final token = await JwtUtils.getToken();
    final userId = await JwtUtils.getUserId();
    final url = userRole == "CUSTOMER"
        ? Uri.parse('http://10.0.2.2:8080/api/customers/$userId/orders')
        : Uri.parse('http://10.0.2.2:8080/api/orders'); // For STAFF role

    if (token == null) {
      print('No token found. User might not be logged in.');
      return;
    }
    if (userId == null) {
      print('No userId found.');
      return;
    }

    try {
      final response = await http.get(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final List<OrderItem> fetchedItems =
        data.map((item) => OrderItem.fromJSON(item)).toList();

        setState(() {
          orderedItems = fetchedItems;
          _isLoading = false;

        });
      } else {
        print('Failed to fetch data: ${response.statusCode}');
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error fetching orders: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  List<OrderItem> get filteredItems {
    if (selectedCategory.toLowerCase() == 'all') return orderedItems;

    return orderedItems.where((item) {
      final statusLower = item.status.toLowerCase();
      final categoryLower = selectedCategory.toLowerCase();

      return statusLower == categoryLower ||
          (statusLower == 'notpaid' && categoryLower == 'not paid') ||
          (statusLower == 'ongoing' && categoryLower == 'on going') ||
          (statusLower == 'finished' && categoryLower == 'finished');
    }).toList();
  }

  Future<Map<String, dynamic>?> getCustomerById(int id) async {
    try {
      // Retrieve token from SharedPreferences
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');  // Assuming 'token' is saved here

      if (token == null) {
        print('Token is missing.');
        return null;
      }

      final response = await http.get(
        Uri.parse('http://10.0.0.2:8080/api/customers/$id'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        // Decode the response body if the request is successful
        final data = json.decode(response.body);

        print(data);
        return data;
      } else {
        // Handle non-200 status code
        print('Failed to fetch customer: ${response.statusCode}');
        return null;
      }
    } catch (error) {
      // Handle error during the request
      print('Error fetching customer: $error');
      return null;
    }
  }

  Widget _buildCategoryButton(String category) {
    final isSelected = selectedCategory == category;

    return GestureDetector(
      onTap: () {
        setState(() {
          selectedCategory = category;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.red : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.red : Colors.grey[400]!,
          ),
        ),
        child: Text(
          category,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.black87,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Future<void> _initializeNotifications() async {
    const AndroidInitializationSettings initializationSettingsAndroid =
    AndroidInitializationSettings('@mipmap/ic_launcher');

    const InitializationSettings initializationSettings =
    InitializationSettings(android: initializationSettingsAndroid);

    await flutterLocalNotificationsPlugin.initialize(initializationSettings);
  }

  Future<void> _showNotification(String title, String body) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
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
      debugPrint('Error saving notification:$e');
    }
  }

  void _onActionTap(int index) {
    setState(() {
      if (orderedItems[index].status == 'Payment') {
        orderedItems[index].status = 'On Going'; // Change status to On Going
      } else if (orderedItems[index].status == 'On Going') {
        orderedItems[index].status = 'Finished'; // Change status to Finished

        // Add notification when status changes to Finished
        final orderName = orderedItems[index].cartItems; // Use appropriate property to identify order name
        final message = 'Pesanan untuk $orderName telah selesai';

        // Save in-app notification
        _saveNotification(message, 'completed');

        // Show in-app notification
        _showNotification('Pesanan Selesai', message);

        // Push Awesome Notification
        AwesomeNotifications().createNotification(
          content: NotificationContent(
            id: DateTime.now().millisecondsSinceEpoch.remainder(100000),
            channelKey: 'order_status_channel',
            title: 'Pesanan Selesai',
            body: message,
            notificationLayout: NotificationLayout.Default,
          ),
        );
      }
    });
  }



  Future<void> acceptOrder() async {
    final token = await JwtUtils.getToken();
    final userId = await JwtUtils.getUserId();
    final url = Uri.parse('http://10.0.2.2:8080/api/orders/$userId/accept');

    try {
      final response = await http.put(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        print('Order Accepted');
        // Optionally refresh or show a success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Order Accepted!')),
        );
      } else {
        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to accept the order.')),
        );
      }
    } catch (e) {
      print('Error: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred.')),
      );
    }
  }

  Future<void> finishOrder() async {
    final token = await JwtUtils.getToken();
    final userId = await JwtUtils.getUserId();
    final url = Uri.parse('http://10.0.2.2:8080/api/orders/$userId/finish');

    try {
      final response = await http.put(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        print('Order Accepted');
        // Optionally refresh or show a success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Order Accepted!')),
        );
      } else {
        print('Response status: ${response.statusCode}');
        print('Response body: ${response.body}');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to accept the order.')),
        );
      }
    } catch (e) {
      print('Error: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('An error occurred.')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    List<String> categories = ['All', 'Not Paid', 'Accepted', 'Finished'];

    return Scaffold(
      backgroundColor: AppColors.whiteBG,
      appBar: AppBar(
        title: const Text("Order List"),
        backgroundColor: Colors.white,
        elevation: 1,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: categories
                  .map((category) => _buildCategoryButton(category))
                  .toList(),
            ),
            const SizedBox(height: 20),
            Expanded(
              child: Builder(
                builder: (context) {
                  return filteredItems.isEmpty
                      ? const Center(child: Text("No orders found"))
                      : ListView.builder(
                    itemCount: filteredItems.length,
                    itemBuilder: (context, index) {
                      final orderItem = filteredItems[index];
                      Color cardColor;
                      if (orderItem.status == 'Not Paid') {
                        cardColor = AppColors.red;
                      } else if (orderItem.status == 'Accepted') {
                        cardColor = AppColors.red;
                      } else {
                        cardColor = AppColors.black;
                      }
                      return GestureDetector(
                        onTap: () => _onActionTap(index), // Fixed to use index
                        child: OrderCard(
                          orderedItem: orderItem,
                          role: userRole ?? 'CUSTOMER',
                          onActionTap: acceptOrder,
                        ),
                      );
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

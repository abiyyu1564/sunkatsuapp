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

class OrderItem {
  final int? id;
  int total;
  final String deliver;
  final int? userID;
  String status;
  final List<CartItem> cartItems;
  final DateTime? paymentDeadline;
  String? username;

  OrderItem({
    required this.id,
    required this.total,
    required this.deliver,
    required this.userID,
    required this.status,
    required this.cartItems,
    required this.paymentDeadline,
    this.username,
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
  String selectedCategory = 'All';
  String? userRole;
  bool _isLoading = true;
  List<OrderItem> orderedItems = [];

  @override
  void initState() {
    super.initState();
    decodeAndSetUserRole();
  }

  Future<void> decodeAndSetUserRole() async {
    final token = await JwtUtils.getToken();
    if (token != null) {
      final payload = await JwtUtils.parseJwtPayload();
      userRole = payload?['role'];
    }
    await fetchOrderItems();
  }

  Future<void> fetchOrderItems() async {
    final token = await JwtUtils.getToken();
    final userId = await JwtUtils.getUserId();
    final url = userRole == "CUSTOMER"
        ? Uri.parse('http://localhost:8080/api/customers/$userId/orders')
        : Uri.parse('http://localhost:8080/api/orders');

    if (token == null || userId == null) {
      print("Token or userId is null");
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
        final List<OrderItem> fetchedItems = [];

        for (var item in data) {
          final order = OrderItem.fromJSON(item);
          print("Processing order with userID: ${order.userID}");

          if (order.userID != null) {
            print("Fetching customer data for userID: ${order.userID}");
            final customerData = await getCustomerById(order.userID!);
            print("Customer data: $customerData");
            order.username = customerData?['username'];
          } else {
            print("userID is null for order: ${order.id}");
          }

          fetchedItems.add(order);
        }

        setState(() {
          orderedItems = fetchedItems;
          _isLoading = false;
        });
      } else {
        print("Failed to fetch orders: ${response.statusCode}");
        setState(() => _isLoading = false);
      }
    } catch (e) {
      print('Error fetching orders: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<Map<String, dynamic>?> getCustomerById(int id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = await JwtUtils.getToken();

      final response = await http.get(
        Uri.parse('http://localhost:8080/api/customers/${id.toString()}'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          'accept': 'application/hal+json',
        },
      );

      print("Response status: ${response.statusCode}");
      print("Response body: ${response.body}");

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        print('Failed to fetch customer: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching customer: $e');
    }
    return null;
  }

  List<OrderItem> get filteredItems {
    if (selectedCategory.toLowerCase() == 'all') return orderedItems;
    return orderedItems.where((item) {
      final statusLower = item.status.toLowerCase();
      final categoryLower = selectedCategory.toLowerCase();
      return statusLower == categoryLower;
    }).toList();
  }

  Future<void> acceptOrder(int orderId) async {
    final token = await JwtUtils.getToken();
    final url = Uri.parse('http://localhost:8080/api/orders/$orderId/accept');
    try {
      final response = await http.put(url, headers: {
        'Authorization': 'Bearer $token',
      });

      if (response.statusCode == 200) {
        fetchOrderItems();
      }
    } catch (e) {
      print('Error: $e');
    }
  }

  Future<void> finishOrder(int orderId) async {
    final token = await JwtUtils.getToken();
    final url = Uri.parse('http://localhost:8080/api/orders/$orderId/finish');
    try {
      final response = await http.put(
        url,
        headers: {
          'Authorization': 'Bearer $token',
          'accept': 'application/hal+json',
        },
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['status']?.toLowerCase() == 'finished') {
          fetchOrderItems();
        }
      }
    } catch (e) {
      print('Error: $e');
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
              child: filteredItems.isEmpty
                  ? const Center(child: Text("No orders found"))
                  : ListView.builder(
                itemCount: filteredItems.length,
                itemBuilder: (context, index) {
                  final orderItem = filteredItems[index];
                  return OrderCard(
                    orderedItem: orderItem,
                    role: userRole ?? 'CUSTOMER',
                    onActionTap: () {
                      if (orderItem.status == 'Not Paid') {
                        acceptOrder(orderItem.id!);
                      } else if (orderItem.status == 'Accepted') {
                        finishOrder(orderItem.id!);
                      }
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

  Widget _buildCategoryButton(String category) {
    final isSelected = selectedCategory == category;
    return GestureDetector(
      onTap: () {
        setState(() => selectedCategory = category);
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
}

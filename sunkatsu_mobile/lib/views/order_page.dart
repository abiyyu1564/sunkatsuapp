<<<<<<< Updated upstream
=======
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:sunkatsu_mobile/models/cart_item.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/widgets/order_card.dart';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';

class OrderItem {
  final int? id;
  final int total;
  final String deliver;
  final int? userID;
  final String status;
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
    final url = Uri.parse('http://10.0.2.2:8080/api/customers/$userId/orders');

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
        data.map((item) => OrderItem.fromJSON(item['OrderItem'])).toList();

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
                        onTap: () {
                          // Implement action when tapped
                        },
                        child: OrderCard(
                          orderedItem: orderItem,
                          role: userRole ?? 'CUSTOMER',
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
>>>>>>> Stashed changes

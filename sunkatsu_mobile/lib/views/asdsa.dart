import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:sunkatsu_mobile/utils/constants.dart'; // Pastikan sudah ada AppColors
import 'package:sunkatsu_mobile/widgets/order_card.dart'; // Pastikan sudah ada OrderCard
import '../models/order.dart';
import '../models/cart_item.dart';
import '../models/menu.dart';

class OrderPage extends StatefulWidget {
  const OrderPage({Key? key}) : super(key: key);

  @override
  State<OrderPage> createState() => _OrderPageState();
}

class _OrderPageState extends State<OrderPage> {
  String selectedCategory = 'All'; // Filter kategori yang dipilih
  late Future<List<Order>> orders;

  @override
  void initState() {
    super.initState();
    orders = fetchOrders(); // Fetch orders when the page is loaded
  }

  // Fetch Orders from the API
  Future<List<Order>> fetchOrders() async {
    final url = Uri.parse('http://10.0.2.2:8080/api/orders'); // Adjust API URL
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Order.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load orders');
      }
    } catch (e) {
      print('Error fetching orders: $e');
      rethrow;
    }
  }

  // Filter orders based on selected category
  List<Order> getFilteredOrders(List<Order> orders) {
    if (selectedCategory == 'All') return orders;
    return orders.where((order) => order.status == selectedCategory).toList();
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

  // Fungsi untuk ubah status
  void _onActionTap(int index, List<Order> orders) {
    setState(() {
      if (orders[index].status == 'Payment') {
        orders[index].status = 'On Going'; // Mengubah status pesanan menjadi On Going
      } else if (orders[index].status == 'On Going') {
        orders[index].status = 'Finished'; // Mengubah status pesanan menjadi Finished
      }
    });
  }

  // Fungsi untuk memindahkan pesanan yang statusnya 'On Going' ke atas
  void _moveToTop(int index, List<Order> orders) {
    setState(() {
      if (orders[index].status == 'On Going') {
        // Mengambil pesanan dan menambahkannya ke paling atas
        final order = orders.removeAt(index);
        orders.insert(0, order); // Memindahkan ke atas
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    List<String> categories = ['All', 'Payment', 'On Going', 'Finished'];

    return Scaffold(
      backgroundColor: AppColors.whiteBG,
      body: SafeArea(
        child: FutureBuilder<List<Order>>(
          future: orders, // Use the future for async data fetching
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Center(child: CircularProgressIndicator());
            }

            if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            }

            if (!snapshot.hasData || snapshot.data!.isEmpty) {
              return Center(child: Text('No orders available.'));
            }

            // Get filtered and sorted orders based on the selected category
            final filteredOrders = getFilteredOrders(snapshot.data!);

            // Sort orders: Move "On Going" to the top, then sort by 'id'
            filteredOrders.sort((a, b) {
              if (a.status == 'On Going' && b.status != 'On Going') return -1;
              if (a.status != 'On Going' && b.status == 'On Going') return 1;
              return a.id.compareTo(b.id);
            });

            return SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),
                    // Category filter
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: categories
                          .map((category) => _buildCategoryButton(category))
                          .toList(),
                    ),
                    const SizedBox(height: 20),
                    // Display filtered and sorted orders
                    ...filteredOrders.map((order) {
                      // Tentukan cardColor berdasarkan status
                      Color cardColor;
                      if (order.status == 'Payment') {
                        cardColor = AppColors.black;
                      } else if (order.status == 'On Going') {
                        cardColor = AppColors.red;
                      } else {
                        cardColor = AppColors.black;
                      }

                      return GestureDetector(
                        onTap: () {
                          if (order.status == 'On Going') {
                            // Pindahkan pesanan "On Going" ke atas
                            final index = filteredOrders.indexOf(order);
                            _moveToTop(index, filteredOrders); // Pindahkan pesanan ke atas
                          }
                        },
                        child: OrderCard(
                          order: order, // Mengirim objek order ke OrderCard
                          role: 'admin',  // Misalnya role admin untuk menampilkan detail pesanan
                          onActionTap: () {
                            // Menangani aksi seperti mengubah status pesanan
                            _onActionTap(filteredOrders.indexOf(order), filteredOrders);
                          },
                        ),
                      );
                    }),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

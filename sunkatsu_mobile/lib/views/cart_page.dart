import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';
import '../models/cart.dart';
import '../utils/jwt_utils.dart';
import '../views/menu_page.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  ShoppingCart? cart;
  bool isLoading = true;
  final String baseUrl = "http://10.0.2.2:8080";

  // Store fetched image bytes here
  Map<String, Uint8List> imageBytesMap = {};

  @override
  void initState() {
    super.initState();
    fetchCart();
  }

  Future<void> fetchCart() async {
    final userId = await JwtUtils.getUserId();
    final token = await JwtUtils.getToken();
    if (userId == null || token == null) {
      setState(() => isLoading = false);
      return;
    }

    try {
      final url = Uri.parse("$baseUrl/api/customers/$userId/cart");
      final response = await http.get(
        url,
        headers: {
          "Authorization": "Bearer $token",
          "accept": "application/hal+json",
        },
      );

      if (response.statusCode == 200) {
        final decoded = json.decode(response.body);
        final parsedCart = ShoppingCart.fromJson(decoded);

        // Fetch images for each menu item
        for (final item in parsedCart.cartItems) {
          final imagePath = item.menu.imageUrl;
          final imageRes = await http.get(
            Uri.parse('$baseUrl$imagePath'),
            headers: {
              'Authorization': 'Bearer $token',
            },
          );

          if (imageRes.statusCode == 200) {
            imageBytesMap[imagePath] = imageRes.bodyBytes;
          } else {
            print("Failed to load image for ${item.menu.name}");
          }
        }

        setState(() {
          cart = parsedCart;
          isLoading = false;
        });
      } else {
        print("Failed to load cart: ${response.statusCode}");
        print("Response body: ${response.body}");
        setState(() => isLoading = false);
      }
    } catch (e, stack) {
      print("Exception while fetching cart: $e");
      print(stack);
      setState(() => isLoading = false);
    }
  }

  Future<void> updateQuantity(int itemId, bool increment) async {
    final token = await JwtUtils.getToken();
    final endpoint = increment ? "increment" : "decrement";
    final url = Uri.parse(
        "$baseUrl/api/carts/$endpoint?id=${cart!.id}&cartItemId=$itemId");

    final response = await http.post(url, headers: {
      "Authorization": "Bearer $token",
    });

    if (response.statusCode == 200) {
      await fetchCart();
    }
  }

  Future<void> deleteItem(int itemId) async {
    final token = await JwtUtils.getToken();
    final url =
    Uri.parse("$baseUrl/api/carts/${cart!.id}/cart-items/$itemId");

    final response = await http.delete(url, headers: {
      "Authorization": "Bearer $token",
    });

    if (response.statusCode == 200) {
      await fetchCart();
    }
  }

  void showDeleteConfirmation(int itemId, String itemName) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Remove Item'),
          content: Text('Are you sure you want to remove "$itemName" from your cart?'),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                deleteItem(itemId);
              },
              child: const Text('Remove', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }

  Future<void> finishCart() async {
    final token = await JwtUtils.getToken();
    final url = Uri.parse("$baseUrl/api/carts/${cart!.id}");

    final response = await http.post(url, headers: {
      "Authorization": "Bearer $token",
    });

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Order placed successfully!"),
          backgroundColor: Color(0xFFE05151),
          duration: Duration(seconds: 2),
        ),
      );
      await fetchCart();
    } else {
      print("Finish cart failed: ${response.body}");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Failed to place order. Please try again."),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'Your Cart',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFFE05151),
        foregroundColor: Colors.white,
        centerTitle: true,
        elevation: 2,
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFFE05151)))
          : cart == null || cart!.cartItems.isEmpty
          ? Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.shopping_cart_outlined, size: 80, color: Colors.grey),
            const SizedBox(height: 16),
            const Text(
              "Your cart is empty",
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              "Add some delicious items to your cart",
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (_) => const MenuPage())); // Go back to menu
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE05151),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: const Text("Browse Menu"),
            ),
          ],
        ),
      )
          : Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              "${cart!.cartItems.length} item${cart!.cartItems.length > 1 ? 's' : ''} in your cart",
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey,
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: cart!.cartItems.length,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemBuilder: (context, index) {
                final item = cart!.cartItems[index];
                final imageData = imageBytesMap[item.menu.imageUrl];
                final itemTotal = item.menu.price * item.quantity;

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  elevation: 2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Image
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: imageData != null
                              ? Image.memory(
                            imageData,
                            width: 80,
                            height: 80,
                            fit: BoxFit.cover,
                          )
                              : Container(
                            width: 80,
                            height: 80,
                            color: Colors.grey.shade200,
                            child: const Icon(Icons.fastfood, size: 40, color: Colors.grey),
                          ),
                        ),
                        const SizedBox(width: 16),
                        // Item details
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.menu.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                "Rp ${NumberFormat("#,###", "id_ID").format(item.menu.price)}",
                                style: TextStyle(
                                  color: Colors.grey.shade700,
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  // Quantity controls
                                  Container(
                                    decoration: BoxDecoration(
                                      border: Border.all(color: Colors.grey.shade300),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Row(
                                      children: [
                                        InkWell(
                                          onTap: () => item.quantity == 1
                                              ? showDeleteConfirmation(item.id, item.menu.name)
                                              : updateQuantity(item.id, false),
                                          child: Container(
                                            padding: const EdgeInsets.all(6),
                                            child: const Icon(Icons.remove, size: 18),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 12),
                                          child: Text(
                                            '${item.quantity}',
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                        ),
                                        InkWell(
                                          onTap: () => updateQuantity(item.id, true),
                                          child: Container(
                                            padding: const EdgeInsets.all(6),
                                            child: const Icon(Icons.add, size: 18),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  // Item total
                                  Text(
                                    "Rp ${NumberFormat("#,###", "id_ID").format(itemTotal)}",
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: Color(0xFFE05151),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        // Delete button
                        IconButton(
                          icon: const Icon(Icons.delete_outline, color: Colors.red),
                          onPressed: () => showDeleteConfirmation(item.id, item.menu.name),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  spreadRadius: 1,
                  blurRadius: 5,
                  offset: const Offset(0, -3),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Subtotal',
                      style: TextStyle(fontSize: 16),
                    ),
                    Text(
                      'Rp ${NumberFormat("#,###", "id_ID").format(cart!.total)}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Divider(),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Total amount',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Rp ${NumberFormat("#,###", "id_ID").format(cart!.total)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontFamily: 'Montserrat',
                        fontSize: 24,
                        color: Color(0xFFE05151),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: finishCart,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFE05151),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 2,
                    ),
                    child: const Text(
                      "Place Order",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
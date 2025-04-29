import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/widgets/cart_item.dart';
import 'package:intl/intl.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {

  // Cart items
  void addItem(CartItem newItem) {
    setState(() {
      items.add(newItem);
    });
  }
  // Sample cart items
  final List<CartItem> items = [
    CartItem(
      name: "Chicken Katsu",
      price: 25000,
      image: "assets/images/food.png",
      quantity: 1,
    ),
    CartItem(
      name: "Ice Tea",
      price: 10000,
      image: "assets/images/drink.png",
      quantity: 1,
    ),
    CartItem(
      name: "Oreo Ice Cream",
      price: 15000,
      image: "assets/images/dessert.png",
      quantity: 1,
    ),
  ];

  // Calculate total amount
  int get totalAmount {
    return items.fold(0, (sum, item) => sum + (item.price * item.quantity));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
            'Your Cart',
        style: TextStyle(
            fontFamily: 'Montserrat',
            fontSize: 30,
            fontWeight: FontWeight.w700,
          ),
      ),
        backgroundColor: const Color(0xFFE05151),
        foregroundColor: Colors.white,
        centerTitle: true,
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // Select all button
                    Expanded(
                      child: ListView.builder(
                        itemCount: items.length,
                        itemBuilder: (context, index) {
                          final item = items[index];
                          // Determine background color based on design version
                          Color? backgroundColor;
                          backgroundColor = Colors.white;

                          return CartItemWidget(
                            item: item,
                            backgroundColor: backgroundColor,
                            textColor: Colors.black,
                            onQuantityChanged: (newQuantity) {
                              setState(() {
                                item.quantity = newQuantity;
                              });
                            },
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Bottom section with total and buy button
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                border: Border(
                  top: BorderSide(color: Colors.grey.shade300),
                ),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Total amount',
                            style: TextStyle(
                              color: Colors.grey,
                              fontSize: 14,
                            ),
                          ),
                          Text(
                            'Rp ${totalAmount == 0 ? "0" : NumberFormat("#,###", "id_ID").format(totalAmount)}',
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              fontFamily: 'Montserrat',
                              fontSize: 24,
                              color: Colors.red,
                            ),
                          ),
                        ],
                      ),
                      ElevatedButton(
                        onPressed: () {
                          // Buy now action
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFE05151),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: const Text('Buy now!'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class CartItem {
  final String name;
  final int price;
  final String image;
  int quantity;
  bool isSelected;

  CartItem({
    required this.name,
    required this.price,
    required this.image,
    this.quantity = 1,
    this.isSelected = false,
  });
}


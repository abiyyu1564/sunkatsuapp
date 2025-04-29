import 'package:flutter/material.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  bool selectAll = false;
  int designVersion = 1; // 1, 2, 3, or 4 corresponding to the designs

  // Cart items
  final List<CartItem> items = [
    CartItem(
      name: "Chicken Katsu",
      price: 25000,
      image: "assets/images/chicken_katsu.png",
      quantity: 1,
    ),
    CartItem(
      name: "Ice Tea",
      price: 10000,
      image: "assets/images/ice_tea.png",
      quantity: 1,
    ),
    CartItem(
      name: "Oreo Ice Cream",
      price: 15000,
      image: "assets/images/oreo_ice_cream.png",
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
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    // Select all button
                    Align(
                      alignment: Alignment.centerLeft,
                      child: ElevatedButton(
                        onPressed: () {
                          setState(() {
                            selectAll = !selectAll;
                            for (var item in items) {
                              item.isSelected = selectAll;
                            }
                          });
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: designVersion == 4
                              ? const Color(0xFFE05151)
                              : Colors.white,
                          foregroundColor: designVersion == 4
                              ? Colors.white
                              : Colors.black,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: const BorderSide(color: Colors.grey),
                          ),
                          elevation: 0,
                        ),
                        child: const Text('Select all'),
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Cart items
                    Expanded(
                      child: ListView.builder(
                        itemCount: items.length,
                        itemBuilder: (context, index) {
                          final item = items[index];
                          // Determine background color based on design version
                          Color? backgroundColor;
                          if (designVersion == 1) {
                            backgroundColor = Colors.white;
                          } else if (designVersion == 2) {
                            backgroundColor = index == 0
                                ? const Color(0xFFE05151)
                                : Colors.white;
                          } else if (designVersion == 3 || designVersion == 4) {
                            backgroundColor = const Color(0xFFE05151);
                          }
        
                          return CartItemWidget(
                            item: item,
                            backgroundColor: backgroundColor,
                            textColor: (designVersion == 3 || designVersion == 4 ||
                                (designVersion == 2 && index == 0))
                                ? Colors.white
                                : Colors.black,
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
                              fontSize: 12,
                            ),
                          ),
                          Text(
                            'Rp ${totalAmount == 0 ? "0" : totalAmount.toString()}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
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

class CartItemWidget extends StatelessWidget {
  final CartItem item;
  final Color? backgroundColor;
  final Color textColor;
  final Function(int) onQuantityChanged;

  const CartItemWidget({
    Key? key,
    required this.item,
    this.backgroundColor,
    this.textColor = Colors.black,
    required this.onQuantityChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        children: [
          // Product image
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.asset(
                item.image,
                width: 80,
                height: 80,
                fit: BoxFit.cover,
                // Use a placeholder for now
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    width: 80,
                    height: 80,
                    color: Colors.grey.shade200,
                    child: Icon(Icons.image, color: Colors.grey.shade400),
                  );
                },
              ),
            ),
          ),
          // Vertical divider
          Container(
            height: 80,
            width: 1,
            color: Colors.grey.shade300,
          ),
          // Product details
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.name,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Quantity controls
                      Row(
                        children: [
                          InkWell(
                            onTap: () {
                              if (item.quantity > 1) {
                                onQuantityChanged(item.quantity - 1);
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: textColor.withOpacity(0.5),
                                ),
                              ),
                              child: Icon(
                                Icons.remove,
                                size: 16,
                                color: textColor,
                              ),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 8.0),
                            child: Text(
                              item.quantity.toString(),
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                          ),
                          InkWell(
                            onTap: () {
                              onQuantityChanged(item.quantity + 1);
                            },
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: textColor.withOpacity(0.5),
                                ),
                              ),
                              child: Icon(
                                Icons.add,
                                size: 16,
                                color: textColor,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Price: Rp. ${item.price}',
                    style: TextStyle(
                      fontSize: 12,
                      color: textColor.withOpacity(0.8),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
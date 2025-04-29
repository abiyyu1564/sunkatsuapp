import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/views/cart_page.dart';

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
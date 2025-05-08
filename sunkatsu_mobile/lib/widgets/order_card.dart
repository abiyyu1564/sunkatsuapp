import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:intl/intl.dart';

class OrderCard extends StatelessWidget {
  final dynamic orderedItem;
  final VoidCallback? onActionTap;
  final String role;

  const OrderCard({
    super.key,
    required this.orderedItem,
    required this.role,
    this.onActionTap,
  });

  @override
  Widget build(BuildContext context) {
    String buttonText;
    switch (orderedItem.status) {
      case 'Accepted':
      case 'On Going':
        buttonText = 'Finish';
        break;
      case 'Not Paid':
        buttonText = 'Accept';
        break;
      default:
        buttonText = 'Done';
    }

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _getCardColor(),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const Icon(Icons.receipt_long, color: Colors.white, size: 40),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'User: ${orderedItem.username ?? 'Unknown'}',
                  style: const TextStyle(color: Colors.white),
                ),
                Text(
                  'Total: Rp ${orderedItem.total}',
                  style: const TextStyle(color: Colors.white),
                ),
                const SizedBox(height: 6),
                Text(
                  (role == 'STAFF' || role == 'OWNER')
                      ? "Orders:"
                      : "Your Orders:",
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 6),
                ...orderedItem.cartItems.map(
                      (item) => Text(
                    '${item.menu.name} x ${item.quantity}',
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      orderedItem.status,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    if ((role == 'STAFF' || role == 'OWNER') &&
                        orderedItem.status != 'Finished')
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 4),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          side: const BorderSide(color: Colors.red),
                        ),
                        onPressed: onActionTap,
                        child: Text(
                          buttonText,
                          style: const TextStyle(color: AppColors.red),
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getCardColor() {
    switch (orderedItem.status) {
      case 'On Going':
        return AppColors.red;
      case 'Not Paid':
        return Colors.orange;
      default:
        return AppColors.black;
    }
  }
}

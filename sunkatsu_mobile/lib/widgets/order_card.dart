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
                if (role == 'STAFF' || role == 'OWNER') // CUSTOMER NAME
                  Text(
                    '${orderedItem.username ?? 'Unknown'}',
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                const SizedBox(height: 6),
                // Text(
                //   (role == 'STAFF' || role == 'OWNER')
                //       ? "Orders:"
                //       : "Your Orders:",
                //   style: const TextStyle(
                //     fontWeight: FontWeight.bold,
                //     color: Colors.white,
                //     fontSize: 18,
                //   ),
                // ),
                const SizedBox(height: 4),
                ...orderedItem.cartItems.map(
                  (item) => Text(
                    '${item.menu.name} x ${item.quantity}',
                    style: const TextStyle(
                      color: AppColors.white,
                      fontSize: 14,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                  if (orderedItem.status == 'Not Paid')
                    Text(
                      role == 'STAFF' || role == "OWNER"
                          ? 'Customer must pay before'
                          : 'Pay at cashier before',
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 16,
                      ),
                    ),
                if (orderedItem.status == 'Not Paid')
                  Text(
                    orderedItem.paymentDeadline != null
                        ? DateFormat('d MMM yyyy, h:mm a').format(orderedItem.paymentDeadline!)
                        : 'No date available',
                    style: const TextStyle(
                      color: AppColors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                const SizedBox(height: 10),
                Text(
                  'Rp ${orderedItem.total}',
                  style: const TextStyle(
                    color: AppColors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      orderedItem.status,
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    if ((role == 'STAFF' || role == 'OWNER') &&
                        orderedItem.status != 'Finished')
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 4,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                        ),
                        onPressed: onActionTap,
                        child: Text(
                          buttonText,
                          style: const TextStyle(
                            color: AppColors.red,
                            fontWeight: FontWeight.bold,
                          ),
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
      case 'Accepted':
        return AppColors.red;
      case 'Not Paid':
        return AppColors.black;
      default:
        return AppColors.grey;
    }
  }
}

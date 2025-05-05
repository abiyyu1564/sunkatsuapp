import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';

class OrderCard extends StatelessWidget {
  final int id;
  final String name;
  final String date;
  final String status;
  final List<String> items;
  final Color color;
  final VoidCallback? onActionTap;
  final String role;

  const OrderCard({
    super.key,
    required this.id,
    required this.name,
    required this.date,
    required this.status,
    required this.items,
    required this.color,
    required this.role,
    this.onActionTap,
  });

  @override
  Widget build(BuildContext context) {
    String buttonText = '';
    if (status == 'Payment') {
      buttonText = 'Pay Now';
    } else if (status == 'On Going') {
      buttonText = 'Finish';
    }

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Tanggal
          Column(
            children:
            date
                .split(' ')
                .map(
                  (line) =>
                  Text(line, style: TextStyle(color: AppColors.white)),
            )
                .toList(),
          ),
          const SizedBox(width: 16),
          // Isi pesanan
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                role == 'admin'
                    ? Text(name, style: TextStyle(color: AppColors.white))
                    : Container(),
                Text(
                  role == 'admin' ? "Orders" : "Your Orders:",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.white,
                  ),
                ),
                const SizedBox(height: 6),
                ...items.map(
                      (item) =>
                      Text(item, style: TextStyle(color: AppColors.white)),
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      status,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppColors.white,
                      ),
                    ),
                    if (role == 'admin' && status != 'Finished')
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 4,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          side: const BorderSide(color: Colors.red),
                        ),
                        onPressed: onActionTap,
                        child: Text(
                            buttonText,
                            style: TextStyle(color: AppColors.red)
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
}

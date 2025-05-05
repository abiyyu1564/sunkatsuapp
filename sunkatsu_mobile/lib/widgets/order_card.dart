import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/utils/constants.dart'; // Pastikan sudah ada AppColors

class OrderCard extends StatelessWidget {
  final dynamic orderedItem; // Menggunakan objek Order
  final VoidCallback? onActionTap;
  final String role;

  const OrderCard({
    super.key,
    required this.orderedItem, // Menggunakan objek Order
    required this.role,
    this.onActionTap,
  });

  @override
  Widget build(BuildContext context) {
    String buttonText = '';
    // Menentukan buttonText berdasarkan status pesanan
    if (orderedItem.status == 'Payment') {
      buttonText = 'Pay Now';
    } else if (orderedItem.status == 'On Going') {
      buttonText = 'Finish';
    }

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _getCardColor(), // Mendapatkan warna berdasarkan status
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Tanggal
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                orderedItem.paymentDeadline != null
                    ? orderedItem.paymentDeadline.toLocal().toString() // Formatkan tanggal jika ada
                    : "No Deadline",
                style: TextStyle(color: AppColors.white),
              ),
            ],
          ),
          const SizedBox(width: 16),
          // Isi pesanan
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                /*
                role == 'admin'
                    ? Text(orderedItem.name, style: TextStyle(color: AppColors.white))
                    : Container(),
                 */
                Text(
                  role == 'admin' ? "Orders" : "Your Orders:",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.white,
                  ),
                ),
                const SizedBox(height: 6),
                ...orderedItem.cartItems.map(
                      (item) => Text(
                    '${item.menu.name} x ${item.quantity}',  // Menampilkan item berdasarkan menu
                    style: TextStyle(color: AppColors.white),
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
                        color: AppColors.white,
                      ),
                    ),
                    if (role == 'admin' && orderedItem.status != 'Finished')
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
                          style: TextStyle(color: AppColors.red),
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

  // Mendapatkan warna card berdasarkan status
  Color _getCardColor() {
    if (orderedItem.status == 'Payment') {
      return AppColors.black;
    } else if (orderedItem.status == 'On Going') {
      return AppColors.red;
    } else {
      return AppColors.black;
    }
  }
}

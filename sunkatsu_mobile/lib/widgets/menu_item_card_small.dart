import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';

class MenuItemCardSmall extends StatelessWidget {
  final String imageUrl;
  final String title;
  final String desc;
  final int price;

  const MenuItemCardSmall({
    super.key,
    required this.imageUrl,
    required this.title,
    required this.desc,
    required this.price,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 100,
      height: 150,
      child: Card(
        color: AppColors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(color: AppColors.black.withAlpha(50), width: 0.65),
        ),
        elevation: 0,
        child: Padding(
          padding: const EdgeInsets.only(left: 15, right: 15, top: 10, bottom: 10),
          // scrollable area kalau tinggi lebih
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              ClipOval(
                child: Image.asset(
                  imageUrl,
                  width: 72,
                  height: 72,
                  fit: BoxFit.cover,
                ),
              ),
              SizedBox(height: 8),
              Text(
                title,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: AppColors.black,
                ),
              ),
              Text(
                desc,
                textAlign: TextAlign.justify,
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 9,
                  color: AppColors.black,
                  height: 1.5,
                ),
              ),
              SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Rp ${price.toString().replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                      color: AppColors.red,
                    ),
                  ),
                  GestureDetector(
                    onTap: () {},
                    child: CircleAvatar(
                      backgroundColor: AppColors.black,
                      radius: 14,
                      child: Icon(Icons.add, color: AppColors.white, size: 20),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:sunkatsu_mobile/utils/constants.dart'; // AppColors

class MyNavBar extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const MyNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  String _getIconPath(String name, bool isActive) {
    return 'assets/icons/${name}_${isActive ? 'filled' : 'outline'}.svg';
  }

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      type: BottomNavigationBarType.fixed,

      selectedItemColor: AppColors.black,
      unselectedItemColor: AppColors.black,
      selectedLabelStyle: const TextStyle(color: AppColors.black),
      unselectedLabelStyle: const TextStyle(color: AppColors.black),

      items: [
        BottomNavigationBarItem(
          icon: SvgPicture.asset(
            _getIconPath('home', currentIndex == 0),
            width: 24,
            height: 24,
          ),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: SvgPicture.asset(
            _getIconPath('menu', currentIndex == 1),
            width: 24,
            height: 24,
          ),
          label: 'Menu',
        ),
        BottomNavigationBarItem(
          icon: SvgPicture.asset(
            _getIconPath('cart', currentIndex == 2),
            width: 24,
            height: 24,
          ),
          label: 'Cart',
        ),
        BottomNavigationBarItem(
          icon: SvgPicture.asset(
            _getIconPath('order', currentIndex == 3),
            width: 24,
            height: 24,
          ),
          label: 'Order',
        ),
        BottomNavigationBarItem(
          icon: SvgPicture.asset(
            _getIconPath('profile', currentIndex == 4),
            width: 24,
            height: 24,
          ),
          label: 'Profile',
        ),
      ],
    );
  }
}

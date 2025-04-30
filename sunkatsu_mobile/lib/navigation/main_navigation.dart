import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/views/home_page.dart';
import 'package:sunkatsu_mobile/views/order_page.dart';
import 'package:sunkatsu_mobile/widgets/nav_bar.dart';


class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    HomePage(),
    Placeholder(),
    Placeholder(),
    OrderPage(),
    Placeholder(),
  ];

  void _onNavbarTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: MyNavBar(
        currentIndex: _currentIndex,
        onTap: _onNavbarTapped,
      ),
    );
  }
}
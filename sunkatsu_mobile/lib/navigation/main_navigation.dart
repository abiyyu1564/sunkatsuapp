import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/views/home_page.dart';
import 'package:sunkatsu_mobile/views/menu_page.dart';
import 'package:sunkatsu_mobile/views/menu_page_owner.dart';
import 'package:sunkatsu_mobile/views/order_page.dart';
import 'package:sunkatsu_mobile/views/cart_page.dart';
import 'package:sunkatsu_mobile/widgets/nav_bar.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> with WidgetsBindingObserver {
  int _currentIndex = 0;

  final List<Widget> _pages = const [
    HomePage(),
    MenuPage(),
    CartPage(),
    OrderPage(),
    Placeholder(),
  ];

  void _onNavbarTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      setState(() {}); // Trigger rebuild to refresh active page
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  List<Widget> _buildPages() {
    return [
      HomePage(key: UniqueKey()),
      MenuPage(key: UniqueKey()),
      CartPage(key: UniqueKey()),
      OrderPage(key: UniqueKey()),
      Placeholder(key: UniqueKey()),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _buildPages(),
      ),
      bottomNavigationBar: MyNavBar(
        currentIndex: _currentIndex,
        onTap: _onNavbarTapped,
      ),
    );
  }
}

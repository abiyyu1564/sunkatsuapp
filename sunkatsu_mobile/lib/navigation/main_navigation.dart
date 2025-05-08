import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/views/home_page.dart';
import 'package:sunkatsu_mobile/views/menu_page.dart';
import 'package:sunkatsu_mobile/views/order_page.dart';
import 'package:sunkatsu_mobile/views/cart_page.dart';
import 'package:sunkatsu_mobile/views/profile_page.dart';
import 'package:sunkatsu_mobile/widgets/nav_bar.dart';
import 'package:sunkatsu_mobile/preview_page.dart';
import 'package:sunkatsu_mobile/views/profile_page.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> with WidgetsBindingObserver {
  int _currentIndex = 0;

  // Store keys for each page to force rebuilds
  final List<Key> _pageKeys = List.generate(5, (_) => UniqueKey());

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    debugPrint("MainNavigation initialized");
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      debugPrint("App resumed - refreshing current page");
      _refreshCurrentPage();
    }
  }

  void _refreshCurrentPage() {
    setState(() {
      // Generate a new key for the current page to force a rebuild
      _pageKeys[_currentIndex] = UniqueKey();
      debugPrint("Refreshed page at index $_currentIndex with new key ${_pageKeys[_currentIndex]}");
    });
  }

  void _onNavbarTapped(int index) {
    debugPrint("Navbar tapped: $index (current: $_currentIndex)");

    if (_currentIndex == index) {
      // If tapping the current tab, refresh it
      _refreshCurrentPage();
    } else {
      setState(() {
        // Generate a new key for the page we're navigating to
        _pageKeys[index] = UniqueKey();
        _currentIndex = index;
        debugPrint("Navigated to page $index with new key ${_pageKeys[index]}");
      });
    }
  }

  // Add a method that can be called from outside to refresh the current page
  void refreshCurrentPage() {
    _refreshCurrentPage();
  }

  Widget _getPage(int index) {
    debugPrint("Building page at index $index with key ${_pageKeys[index]}");

    switch (index) {
      case 0:
        return HomePage(key: _pageKeys[0]);
      case 1:
        return MenuPage(key: _pageKeys[1]);
      case 2:
        return CartPage(key: _pageKeys[2]);
      case 3:
        return OrderPage(key: _pageKeys[3]);
      case 4:
        return ProfilePage(key: _pageKeys[4]);
      default:
        return HomePage(key: _pageKeys[0]);
    }
  }

  @override
  Widget build(BuildContext context) {
    debugPrint("Building MainNavigation with current index: $_currentIndex");

    return Scaffold(
      body: _getPage(_currentIndex),
      bottomNavigationBar: MyNavBar(
        currentIndex: _currentIndex,
        onTap: _onNavbarTapped,
      ),
    );
  }
}
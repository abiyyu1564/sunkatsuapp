import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/widgets/menu_item_card_big.dart';
import 'package:sunkatsu_mobile/widgets/menu_item_card_small.dart';
import 'package:sunkatsu_mobile/widgets/nav_bar.dart'; // Impor MyNavBar
import 'package:sunkatsu_mobile/widgets/search_bar.dart';
import 'package:flutter_svg/flutter_svg.dart';

class PreviewPage extends StatefulWidget {
  const PreviewPage({super.key});

  @override
  _PreviewPageState createState() => _PreviewPageState();
}

class _PreviewPageState extends State<PreviewPage> {
  int _currentIndex = 0; // Menambahkan variabel untuk track index navbar
  List<String> _searchResults = [];
  List<String> _dummyData = List.generate(
    10,
        (index) => 'Search result $index',
  );

  void _search(String query) {
    setState(() {
      _searchResults =
          _dummyData
              .where((item) => item.toLowerCase().contains(query.toLowerCase()))
              .toList();
    });
  }

  // Fungsi untuk menangani tap pada navbar
  void _onNavbarTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteBG,
      appBar: AppBar(
        title: const Text(''),
        backgroundColor: AppColors.white,
        elevation: 0,
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: IconButton(
              icon: SvgPicture.asset(
                '/assets/icons/location.svg',
                width: 24,
                height: 24,
                color: AppColors.black,
              ),
              onPressed: () {
                // Action when location icon is clicked
                print('Location icon clicked');
              },
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(  // Wrap the entire body content with SingleChildScrollView
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CustomSearchBar(onSearch: _search),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Your trusted picks!',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  GestureDetector(
                    onTap: () {},
                    child: const Text(
                      'View All',
                      style: TextStyle(fontSize: 12, color: AppColors.black),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 220, // tinggi scroll area
                child: GridView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: 6,
                  gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                    maxCrossAxisExtent: 280,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 3 / 2,
                  ),
                  itemBuilder: (context, index) {
                    return MenuItemCardSmall(
                      imageUrl: 'assets/images/food.png',
                      title: 'Chicken Katsu',
                      desc:
                      'Tasty and crispy! Tasty and crispy! Tasty and crispy! Tasty and crispy!',
                      price: 25000,
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),
              // Correctly placed Text widget for "Recommendation"
              Text(
                'Recommendation',
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 16),
              // Second GridView for Recommendations
              SizedBox(
                height: 380, // tinggi scroll area
                child: GridView.builder(
                  scrollDirection: Axis.vertical,
                  itemCount: 6,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 1,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 4 / 2,
                  ),
                  itemBuilder: (context, index) {
                    return MenuItemCardBig(
                      imageUrl: 'assets/images/food.png',
                      title: 'Chicken Katsu',
                      desc:
                      'Tasty and crispy! Tasty and crispy! Tasty and crispy! Tasty and crispy!',
                      price: 25000,
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: MyNavBar(
        currentIndex: _currentIndex, // Menambahkan currentIndex
        onTap: _onNavbarTapped, // Menghubungkan dengan fungsi _onNavbarTapped
      ),
    );
  }
}

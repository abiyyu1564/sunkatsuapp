import 'package:flutter/material.dart';
import 'food_detail_page.dart';
import 'package:sunkatsu_mobile/widgets/menu_item_card_big.dart'; // Ganti sesuai path komponen aslinya
import 'package:sunkatsu_mobile/widgets/nav_bar.dart'; // Ganti sesuai path komponen aslinya

class FoodItem {
  final String name;
  final String description;
  final String price;
  final String imageUrl;
  final String category;

  FoodItem({
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.category,
  });
}

class MenuPageOwner extends StatefulWidget {
  const MenuPageOwner({super.key});

  @override
  State<MenuPageOwner> createState() => _MenuPageOwnerState();
}

class _MenuPageOwnerState extends State<MenuPageOwner> {
  int _currentIndex = 0;
  String selectedCategory = 'All';
  int selectedNavIndex = 1; // Menu tab selected by default

  void _onNavbarTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  final List<FoodItem> foodItems = [
    FoodItem(
      name: 'Chicken Katsu',
      description: 'Tasty and crispy! Tasty and crispy! Tasty and crispy!',
      price: 'Rp 25.000',
      imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kLxFO8TEkLK0da8yBegS4hwRpqNbTT.png',
      category: 'Food',
    ),
    FoodItem(
      name: 'Ice Tea',
      description: 'Fresh and cool ice tea!',
      price: 'Rp 5.000',
      imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ullqLB8QHesouhh5Tbjuurxhg67QE1.png',
      category: 'Drink',
    ),
    FoodItem(
      name: 'Oreo Ice Cream',
      description: 'Delicious Oreo ice cream!',
      price: 'Rp 10.000',
      imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ullqLB8QHesouhh5Tbjuurxhg67QE1.png',
      category: 'Dessert',
    ),
  ];

  List<FoodItem> get filteredItems {
    if (selectedCategory == 'All') {
      return foodItems;
    } else {
      return foodItems.where((item) => item.category == selectedCategory).toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            Icon(Icons.location_on, size: 20, color: Colors.grey[700]),
            const SizedBox(width: 8),
            Text(
              'TULT, Telkom University',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.grey[800],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
            color: Colors.grey[800],
          ),
        ],
      ),
      body: Column(
        children: [
          // Category filters
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: Colors.white,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildCategoryButton('All'),
                  const SizedBox(width: 8),
                  _buildCategoryButton('Food'),
                  const SizedBox(width: 8),
                  _buildCategoryButton('Drink'),
                  const SizedBox(width: 8),
                  _buildCategoryButton('Dessert'),
                ],
              ),
            ),
          ),

          // Food items list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: filteredItems.length,
              itemBuilder: (context, index) {
                final item = filteredItems[index];

                // Convert price string (e.g., "Rp 25.000") to integer
                final int parsedPrice = int.tryParse(
                  item.price.replaceAll(RegExp(r'[^\d]'), ''),
                ) ??
                    0;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: MenuItemCardBig(
                    imageUrl: 'assets/images/food.png',
                    title: 'Chicken Katsu',
                    desc: 'Tasty and crispy! Tasty and crispy! Tasty and crispy!',
                    price: 25000,
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 16), // naik sedikit
        child: FloatingActionButton(
          onPressed: () {
            // TODO: Add new item
          },
          backgroundColor: const Color(0xFFE15B5B),
          child: const Icon(Icons.add),
        ),
      ),
        bottomNavigationBar: MyNavBar(
          currentIndex: _currentIndex,
          onTap: _onNavbarTapped,
        ),
    );
  }

  Widget _buildCategoryButton(String category) {
    final isSelected = selectedCategory == category;

    return GestureDetector(
      onTap: () {
        setState(() {
          selectedCategory = category;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFE15B5B) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFFE15B5B) : Colors.grey[300]!,
          ),
        ),
        child: Text(
          category,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.grey[800],
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}

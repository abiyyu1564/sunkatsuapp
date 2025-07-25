import 'package:flutter/material.dart';
import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'food_detail_page.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/widgets/nav_bar.dart';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';

class MenuItem {
  final int? id;
  final String name;
  final String imageUrl;
  final int price;
  final String desc;
  final String category;

  MenuItem({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.price,
    required this.desc,
    required this.category,
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      id: (json['id'] ?? 0) as int,
      name: json['name'] ?? '',
      imageUrl: json['image'] ?? '', // Pastikan hanya nama file
      price: json['price'] ?? 0,
      desc: json['desc'] ?? '',
      category: json['category'] ?? '',
    );
  }
}

class MenuPageOwner extends StatefulWidget {
  const MenuPageOwner({super.key});

  @override
  State<MenuPageOwner> createState() => _MenuPageOwnerState();
}

class _MenuPageOwnerState extends State<MenuPageOwner> {
  int _currentIndex = 0;
  String selectedCategory = 'All';
  int selectedNavIndex = 1;

  List<MenuItem> foodItems = [];
  Map<String, Uint8List> imageBytesMap = {}; // Tambahkan ini

  @override
  void initState() {
    super.initState();
    fetchMenuItems();
  }

  Future<void> fetchMenuItems() async {
    const String apiUrl = 'http://10.0.2.2:8080/api/menus';
    final token = await JwtUtils.getToken();

    if (token == null) {
      print('No token found. User might not be logged in.');
      return;
    }

    try {
      final response = await http.get(
        Uri.parse(apiUrl),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final List<MenuItem> fetchedItems =
        data.map((item) => MenuItem.fromJson(item)).toList();

        // Fetch image blobs
        for (final item in fetchedItems) {
          try {
            final imageResponse = await http.get(
              Uri.parse(
                  'http://10.0.2.2:8080/api/menus/images/${item.imageUrl}'),
              headers: {
                'Authorization': 'Bearer $token',
              },
            );
            if (imageResponse.statusCode == 200) {
              imageBytesMap[item.imageUrl] = imageResponse.bodyBytes;
            } else {
              print('Failed to load image for ${item.name}');
            }
          } catch (e) {
            print('Error fetching image for ${item.name}: $e');
          }
        }

        setState(() {
          foodItems = fetchedItems;
        });
      } else {
        print('Failed to fetch data: ${response.statusCode}');
        print('Body: ${response.body}');
      }
    } catch (e) {
      print('Error fetching menu: $e');
    }
  }

  void _onNavbarTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  List<MenuItem> get filteredItems {
    if (selectedCategory == 'Food') {
      selectedCategory = 'food';
    }else if (selectedCategory == 'Drink') {
      selectedCategory = 'drink';
    }else if (selectedCategory == 'Dessert') {
      selectedCategory = 'dessert';
    }

    if (selectedCategory == 'All') {
      return foodItems;
    } else {
      return foodItems
          .where((item) => item.category == selectedCategory)
          .toList();
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
                color: AppColors.grey,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
            color: AppColors.grey,
          ),
        ],
      ),
      body: Column(
        children: [
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
          Expanded(
            child: foodItems.isEmpty
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: filteredItems.length,
              itemBuilder: (context, index) {
                final item = filteredItems[index];
                return _buildFoodItemCard(item, context);
              },
            ),
          ),
        ],
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
            color: isSelected ? Colors.white : AppColors.grey,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }

  Widget _buildFoodItemCard(MenuItem item, BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => FoodDetailPage(
              foodData: {
                'id': item.id,
                'name': item.name,
                'category': item.category,
                'price': item.price,
                'image': item.imageUrl,
                'description': item.desc,
              },
            ),
          ),
        );
      },
      child: SizedBox(
        height: 180,
        child: Card(
          color: AppColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(
              color: AppColors.black.withAlpha(50),
              width: 0.65,
            ),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ClipOval(
                  child: imageBytesMap.containsKey(item.imageUrl)
                      ? Image.memory(
                    imageBytesMap[item.imageUrl]!,
                    width: 150,
                    height: 150,
                    fit: BoxFit.cover,
                  )
                      : const Icon(Icons.broken_image, size: 80),
                ),
                const SizedBox(width: 35),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        item.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: AppColors.black,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        item.desc,
                        maxLines: 3,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 11,
                          color: Colors.black87,
                          height: 1.4,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Rp ${item.price.toString().replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppColors.red,
                            ),
                          ),
                          GestureDetector(
                            onTap: () {
                              // your edit handler here
                            },
                            child: const Icon(
                              Icons.edit_outlined,
                              size: 22,
                              color: AppColors.black,
                            ),
                          )
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

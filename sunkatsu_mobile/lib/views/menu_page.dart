import 'package:flutter/material.dart';
import 'dart:convert';
import 'dart:typed_data';
import 'package:http/http.dart' as http;
import 'food_detail_page.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/widgets/nav_bar.dart';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'package:sunkatsu_mobile/views/food_edit.dart';
import 'package:sunkatsu_mobile/models/menu.dart';
import 'package:sunkatsu_mobile/views/add_menu.dart';

class MenuPage extends StatefulWidget {
  const MenuPage({super.key});

  @override
  State<MenuPage> createState() => _MenuPageState();
}

class _MenuPageState extends State<MenuPage> {
  String selectedCategory = 'All';
  String? userRole;
  bool isLoading = true;
  List<Menu> foodItems = [];
  Map<String, Uint8List> imageBytesMap = {};

  @override
  void initState() {
    super.initState();
    decodeAndSetUserRole();
    fetchMenuItems(forceReloadImages: true);
  }

  Future<void> _refreshAfterPop() async {
    await Future.delayed(const Duration(milliseconds: 300));
    await fetchMenuItems(forceReloadImages: true);
  }


  Future<void> decodeAndSetUserRole() async {
    final token = await JwtUtils.getToken();
    if (token != null) {
      final payload = await JwtUtils.parseJwtPayload();
      setState(() {
        userRole = payload?['role'];
        isLoading = false;
      });
    } else {
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> fetchMenuItems({bool forceReloadImages = false}) async {
    const String apiUrl = 'http://localhost:8080/api/menus';
    final token = await JwtUtils.getToken();

    if (token == null) return;

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
        final List<Menu> fetchedItems = data.map((item) => Menu.fromJson(item)).toList();

        for (final item in fetchedItems) {
          try {
            final imageUrl = 'http://localhost:8080${item.imageUrl}';
            final imageResponse = await http.get(
              Uri.parse(imageUrl),
              headers: {'Authorization': 'Bearer $token'},
            );

            if (imageResponse.statusCode == 200) {
              // Force update image cache
              imageBytesMap[item.imageUrl] = imageResponse.bodyBytes;
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
      }
    } catch (e) {
      print('Error fetching menu: $e');
    }
  }

  List<Menu> get filteredItems {
    if (selectedCategory == 'All') return foodItems;
    return foodItems.where((item) => item.category == selectedCategory.toLowerCase()).toList();
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

  Widget _buildFoodItemCard(Menu item) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => FoodDetailPage(foodData: {
              'id': item.id,
              'name': item.name,
              'category': item.category,
              'price': item.price,
              'image': item.imageUrl,
              'description': item.desc,
            }),
          ),
        ).then((_) {
          fetchMenuItems(forceReloadImages: true);
        });
      },
      child: SizedBox(
        height: 180,
        child: Card(
          color: AppColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(color: AppColors.black.withAlpha(50), width: 0.65),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
            child: Row(
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
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      const SizedBox(height: 6),
                      Text(item.desc, maxLines: 3, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 11)),
                      const SizedBox(height: 8),
                      Text('Rp ${item.price.toString().replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.red)),
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

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Row(
          children: [
            Icon(Icons.location_on, size: 20, color: Colors.grey[700]),
            const SizedBox(width: 8),
            Text('TULT, Telkom University', style: TextStyle(color: Colors.grey[800], fontSize: 16)),
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
      floatingActionButton: userRole == 'OWNER'
          ? FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AddMenuPage()),
          );

          if (result == true) {
            await _refreshAfterPop();
          }


          if (result == true) {
            await fetchMenuItems(forceReloadImages: true); // 💥 Fetch ulang
          }
        },
        backgroundColor: const Color(0xFFE15B5B),
        child: const Icon(Icons.add),
      )
          : null,
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
              itemBuilder: (context, index) => _buildFoodItemCard(filteredItems[index]),
            ),
          ),
        ],
      ),
    );
  }
}

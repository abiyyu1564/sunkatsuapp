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
  bool isRefreshing = false; // New flag for refresh state
  List<Menu> foodItems = [];
  Map<String, Uint8List> imageBytesMap = {};

  @override
  void initState() {
    super.initState();
    decodeAndSetUserRole();
    fetchMenuItems(forceReloadImages: true);

    // Add a focus listener to refresh when page gets focus again
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final focusNode = FocusNode();
      FocusScope.of(context).requestFocus(focusNode);
      focusNode.addListener(() {
        if (focusNode.hasFocus) {
          fetchMenuItems(forceReloadImages: true);
        }
      });
    });
  }

  Future<void> _refreshAfterPop() async {
    await Future.delayed(const Duration(milliseconds: 100)); // Reduced delay
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
    if (!mounted) return;

    setState(() {
      isRefreshing = true; // Show refresh indicator
    });

    const String apiUrl = 'http://localhost:8080/api/menus';
    final token = await JwtUtils.getToken();

    if (token == null) {
      if (mounted) {
        setState(() {
          isRefreshing = false;
          isLoading = false;
        });
      }
      return;
    }

    try {
      // Fetch menu items
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

        // Update state with new menu items immediately
        if (mounted) {
          setState(() {
            foodItems = fetchedItems;
            isLoading = false;
          });
        }

        // Fetch images in parallel instead of sequentially
        final List<Future<void>> imageFutures = [];

        for (final item in fetchedItems) {
          // Skip already loaded images unless forced reload
          if (!forceReloadImages && imageBytesMap.containsKey(item.imageUrl)) {
            continue;
          }

          imageFutures.add(_fetchSingleImage(item.imageUrl, token));
        }

        // Wait for all image fetches to complete
        await Future.wait(imageFutures);

        // Update UI after all images are loaded
        if (mounted) {
          setState(() {
            isRefreshing = false;
          });
        }
      } else {
        debugPrint('Failed to fetch data: ${response.statusCode}');
        if (mounted) {
          setState(() {
            isRefreshing = false;
            isLoading = false;
          });
        }
      }
    } catch (e) {
      debugPrint('Error fetching menu: $e');
      if (mounted) {
        setState(() {
          isRefreshing = false;
          isLoading = false;
        });
      }
    }
  }

  // Helper method to fetch a single image
  Future<void> _fetchSingleImage(String imageUrl, String token) async {
    try {
      final url = 'http://localhost:8080${imageUrl}';
      final imageResponse = await http.get(
        Uri.parse(url),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (imageResponse.statusCode == 200 && mounted) {
        setState(() {
          imageBytesMap[imageUrl] = imageResponse.bodyBytes;
        });
      }
    } catch (e) {
      debugPrint('Error fetching image for $imageUrl: $e');
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
            settings: const RouteSettings(name: '/food-detail'),
          ),
        ).then((result) {
          // Check if we need to refresh based on the returned result
          if (result == true) {
            debugPrint("Refreshing menu after returning from detail page");
            fetchMenuItems(forceReloadImages: true);
          }
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
                // Image with loading indicator
                ClipOval(
                  child: imageBytesMap.containsKey(item.imageUrl)
                      ? Image.memory(
                    imageBytesMap[item.imageUrl]!,
                    width: 150,
                    height: 150,
                    fit: BoxFit.cover,
                  )
                      : Container(
                    width: 150,
                    height: 150,
                    color: Colors.grey[200],
                    child: const Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: AppColors.red,
                      ),
                    ),
                  ),
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

    // Use a static route name for navigation purposes
    const routeName = '/menu';

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
          // Add refresh button
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => fetchMenuItems(forceReloadImages: true),
            color: Colors.grey[800],
          ),
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
            MaterialPageRoute(
              builder: (context) => const AddMenuPage(),
              settings: const RouteSettings(name: '/add-menu'),
            ),
          );

          if (result == true) {
            debugPrint("Refreshing menu after adding new item");
            await fetchMenuItems(forceReloadImages: true);
          }
        },
        backgroundColor: const Color(0xFFE15B5B),
        child: const Icon(Icons.add),
      )
          : null,
      body: Stack(
        children: [
          Column(
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
                child: RefreshIndicator(
                  onRefresh: () => fetchMenuItems(forceReloadImages: true),
                  child: foodItems.isEmpty
                      ? const Center(child: Text("No menu items available"))
                      : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredItems.length,
                    itemBuilder: (context, index) => _buildFoodItemCard(filteredItems[index]),
                  ),
                ),
              ),
            ],
          ),

          // Overlay loading indicator during refresh
          if (isRefreshing)
            Container(
              color: Colors.black.withOpacity(0.1),
              child: const Center(
                child: Card(
                  elevation: 4,
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        CircularProgressIndicator(color: AppColors.red),
                        SizedBox(height: 16),
                        Text("Loading menu...", style: TextStyle(fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

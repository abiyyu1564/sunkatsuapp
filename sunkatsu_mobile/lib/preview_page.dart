import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:typed_data';
import 'package:sunkatsu_mobile/models/menu.dart';
import 'package:sunkatsu_mobile/views/food_detail_page.dart';

class PreviewPage extends StatefulWidget {
  const PreviewPage({Key? key}) : super(key: key);

  @override
  State<PreviewPage> createState() => _PreviewPageState();
}

class _PreviewPageState extends State<PreviewPage> {
  List<Menu> menuItems = [];
  List<Menu> recommendedItems = [];
  Map<String, Uint8List> imageBytesMap = {};
  bool isLoading = true;
  String searchQuery = '';
  List<Menu> searchResults = [];

  @override
  void initState() {
    super.initState();
    debugPrint("PreviewPage initialized with key: ${widget.key}");
    fetchMenuItems();
  }

  Future<void> fetchMenuItems() async {
    debugPrint("Fetching menu items for PreviewPage");

    if (!mounted) return;

    setState(() {
      isLoading = true;
    });

    const String apiUrl = 'http://localhost:8080/api/menus';
    final token = await JwtUtils.getToken();

    if (token == null) {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
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
        final List<Menu> fetchedItems = data.map((item) => Menu.fromJson(item)).toList();
        debugPrint("Fetched ${fetchedItems.length} menu items");

        // Fetch images for each menu item
        for (final item in fetchedItems) {
          try {
            final imageUrl = 'http://localhost:8080${item.imageUrl}';
            final imageResponse = await http.get(
              Uri.parse(imageUrl),
              headers: {'Authorization': 'Bearer $token'},
            );

            if (imageResponse.statusCode == 200) {
              imageBytesMap[item.imageUrl] = imageResponse.bodyBytes;
            }
          } catch (e) {
            debugPrint('Error fetching image for ${item.name}: $e');
          }
        }

        // Sort by most popular (you can adjust this logic)
        final sortedItems = List<Menu>.from(fetchedItems);
        // For now, just use the first few items as recommendations

        if (mounted) {
          setState(() {
            menuItems = fetchedItems;
            recommendedItems = sortedItems.take(min(6, sortedItems.length)).toList();
            isLoading = false;
            debugPrint("Updated state with ${menuItems.length} menu items");
          });
        }
      } else {
        debugPrint('Failed to fetch data: ${response.statusCode}');
        if (mounted) {
          setState(() {
            isLoading = false;
          });
        }
      }
    } catch (e) {
      debugPrint('Error fetching menu: $e');
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  void performSearch(String query) {
    setState(() {
      searchQuery = query;
      if (query.isEmpty) {
        searchResults = [];
      } else {
        searchResults = menuItems
            .where((item) =>
        item.name.toLowerCase().contains(query.toLowerCase()) ||
            item.desc.toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
    });
  }

  int min(int a, int b) {
    return a < b ? a : b;
  }

  @override
  Widget build(BuildContext context) {
    debugPrint("Building PreviewPage with key: ${widget.key}");

    return Scaffold(
      backgroundColor: AppColors.whiteBG,
      appBar: AppBar(
        title: const Text('Preview Page'),
        backgroundColor: AppColors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              debugPrint("Manual refresh button pressed");
              fetchMenuItems();
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          debugPrint("Pull-to-refresh triggered");
          await fetchMenuItems();
        },
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Search bar
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: TextField(
                    onChanged: performSearch,
                    decoration: InputDecoration(
                      hintText: 'Search for food...',
                      prefixIcon: const Icon(Icons.search),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(30),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[200],
                      contentPadding: const EdgeInsets.symmetric(vertical: 0),
                    ),
                  ),
                ),

                // Debug info
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Text(
                    "Items loaded: ${menuItems.length}",
                    style: const TextStyle(color: Colors.grey),
                  ),
                ),

                // Search results
                if (searchQuery.isNotEmpty)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 20),
                      Text(
                        'Search Results',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),
                      searchResults.isEmpty
                          ? const Padding(
                        padding: EdgeInsets.all(20.0),
                        child: Center(child: Text('No results found')),
                      )
                          : ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: searchResults.length,
                        itemBuilder: (context, index) {
                          final item = searchResults[index];
                          return _buildFoodItemCard(item);
                        },
                      ),
                      const SizedBox(height: 20),
                    ],
                  )
                else
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
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
                        height: 220,
                        child: menuItems.isEmpty
                            ? const Center(child: Text("No menu items available"))
                            : ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: min(menuItems.length, 6),
                          itemBuilder: (context, index) {
                            final item = menuItems[index];
                            return _buildSmallCard(item);
                          },
                        ),
                      ),
                      const SizedBox(height: 20),
                      Text(
                        'Recommendation',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 16),
                      recommendedItems.isEmpty
                          ? const Center(child: Text("No recommendations available"))
                          : ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: recommendedItems.length,
                        itemBuilder: (context, index) {
                          final item = recommendedItems[index];
                          return _buildFoodItemCard(item);
                        },
                      ),
                    ],
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSmallCard(Menu item) {
    return GestureDetector(
      onTap: () {
        _navigateToFoodDetail(item);
      },
      child: Container(
        width: 150,
        margin: const EdgeInsets.only(right: 16),
        child: Card(
          color: AppColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(color: AppColors.black.withAlpha(50), width: 0.65),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ClipOval(
                  child: imageBytesMap.containsKey(item.imageUrl)
                      ? Image.memory(
                    imageBytesMap[item.imageUrl]!,
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover,
                  )
                      : const Icon(Icons.broken_image, size: 80),
                ),
                const SizedBox(height: 8),
                Text(
                  item.name,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  'Rp ${item.price.toString().replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: AppColors.red,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFoodItemCard(Menu item) {
    return GestureDetector(
      onTap: () {
        _navigateToFoodDetail(item);
      },
      child: Container(
        height: 120,
        margin: const EdgeInsets.only(bottom: 16),
        child: Card(
          color: AppColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: BorderSide(color: AppColors.black.withAlpha(50), width: 0.65),
          ),
          elevation: 0,
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                ClipOval(
                  child: imageBytesMap.containsKey(item.imageUrl)
                      ? Image.memory(
                    imageBytesMap[item.imageUrl]!,
                    width: 80,
                    height: 80,
                    fit: BoxFit.cover,
                  )
                      : const Icon(Icons.broken_image, size: 80),
                ),
                const SizedBox(width: 16),
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
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.desc,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Rp ${item.price.toString().replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                          color: AppColors.red,
                        ),
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

  void _navigateToFoodDetail(Menu item) {
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
    ).then((result) {
      // Refresh data when returning from detail page
      if (result == true) {
        fetchMenuItems();
      }
    });
  }
}

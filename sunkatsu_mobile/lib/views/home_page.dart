import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:http/http.dart' as http;
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/widgets/nav_bar.dart';
import 'package:sunkatsu_mobile/widgets/search_bar.dart';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'package:sunkatsu_mobile/views/chat_page.dart';
import 'package:sunkatsu_mobile/views/chatbot_page.dart';
import 'package:sunkatsu_mobile/views/menu_page.dart';
import 'package:sunkatsu_mobile/views/food_detail_page.dart';

class MenuItem {
  final int id;
  final String name;
  final String image;
  final int price;
  final String desc;
  final String category;

  MenuItem({
    required this.id,
    required this.name,
    required this.image,
    required this.price,
    required this.desc,
    required this.category,
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    return MenuItem(
      id: json['id'],
      name: json['name'],
      image: json['image'],
      price: json['price'],
      desc: json['desc'],
      category: json['category'],
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;

  List<MenuItem> _searchResults = [];
  bool _isSearching = false;
  String _searchQuery = '';

  List<MenuItem> favorites = [];
  List<MenuItem> allMenus = [];
  Map<String, Uint8List> imageBytesMap = {};
  bool _isLoadingFavorites = true;
  bool _isLoadingMenus = true;

  @override
  void initState() {
    super.initState();
    fetchFavorites();
    fetchAllMenus();
  }

  void _search(String query) {
    setState(() {
      _searchQuery = query;

      if (query.isEmpty) {
        _isSearching = false;
        _searchResults = [];
        return;
      }

      _isSearching = true;

      // Search in both allMenus and favorites
      final List<MenuItem> combinedMenus = [...allMenus, ...favorites];

      // Remove duplicates (items might be in both lists)
      final Map<int, MenuItem> uniqueItems = {};
      for (var item in combinedMenus) {
        uniqueItems[item.id] = item;
      }

      // Filter based on search query
      _searchResults = uniqueItems.values.where((item) {
        return item.name.toLowerCase().contains(query.toLowerCase()) ||
            item.desc.toLowerCase().contains(query.toLowerCase()) ||
            item.category.toLowerCase().contains(query.toLowerCase());
      }).toList();
    });
  }

  Future<void> fetchFavorites() async {
    final token = await JwtUtils.getToken();
    final userId = await JwtUtils.getUserId();

    if (token == null || userId == null) return;

    final url = Uri.parse('http://10.0.2.2:8080/api/customers/$userId/favorites');

    try {
      final response = await http.get(url, headers: {'Authorization': 'Bearer $token'});

      if (response.statusCode == 200) {
        final List<dynamic> jsonData = json.decode(response.body);
        final List<MenuItem> fetchedItems = jsonData
            .map((e) => MenuItem.fromJson(e['menu']))
            .toList();

        for (final item in fetchedItems) {
          await _fetchImageBlob(item.image, token, forceReload: true); // gunakan forceReload
        }

        setState(() {
          favorites = fetchedItems;
        });
      }
    } catch (e) {
      print('Error fetching favorites: $e');
    } finally {
      setState(() {
        _isLoadingFavorites = false;
      });
    }
  }

  Future<void> fetchAllMenus() async {
    final token = await JwtUtils.getToken();

    if (token == null) return;

    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/menus'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> jsonData = json.decode(response.body);
        final List<MenuItem> fetchedMenus = jsonData
            .map((e) => MenuItem.fromJson(e))
            .take(6)
            .toList();

        for (final item in fetchedMenus) {
          await _fetchImageBlob(item.image, token, forceReload: true); // gunakan forceReload
        }

        setState(() {
          allMenus = fetchedMenus;
        });
      }
    } catch (e) {
      print('Error fetching menus: $e');
    } finally {
      setState(() {
        _isLoadingMenus = false;
      });
    }
  }

  Future<void> _fetchImageBlob(String imageName, String token, {bool forceReload = false}) async {
    if (!forceReload && imageBytesMap.containsKey(imageName)) return;

    try {
      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080/api/menus/images/$imageName'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        setState(() {
          imageBytesMap[imageName] = response.bodyBytes;
        });
      }
    } catch (e) {
      print('Image fetch error: $e');
    }
  }


  Widget _buildFavoriteCard(MenuItem item) {
    return GestureDetector(
      onTap: () async {
        await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => FoodDetailPage(
              foodData: {
                'id': item.id,
                'name': item.name,
                'category': item.category,
                'price': item.price,
                'image': item.image,
                'description': item.desc,
              },
            ),
          ),
        );

        // Setelah kembali dari detail page, refresh menu dan favorites
        setState(() {
          _isLoadingMenus = true;
          _isLoadingFavorites = true;
        });
        await fetchAllMenus();
        await fetchFavorites();
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
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ClipOval(
                  child: imageBytesMap.containsKey(item.image)
                      ? Image.memory(
                    imageBytesMap[item.image]!,
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
                      Text(item.name,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: AppColors.black)),
                      const SizedBox(height: 6),
                      Text(item.desc,
                          maxLines: 3,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11,
                            color: Colors.black87,
                            height: 1.4,
                          )),
                      const SizedBox(height: 8),
                      Text(
                        'Rp ${item.price.toString().replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
                        style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: AppColors.red),
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

  Widget _buildMenuPreviewCard(MenuItem item) {
    return GestureDetector(
      onTap: () async {
        await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => FoodDetailPage(
              foodData: {
                'id': item.id,
                'name': item.name,
                'category': item.category,
                'price': item.price,
                'image': item.image,
                'description': item.desc,
              },
            ),
          ),
        );

        // Setelah kembali dari detail page, refresh menu dan favorites
        setState(() {
          _isLoadingMenus = true;
          _isLoadingFavorites = true;
        });
        await fetchAllMenus();
        await fetchFavorites();
      },

      child: SizedBox(
        width: 300, // Increased width to accommodate the new layout
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
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ClipOval(
                  child: imageBytesMap.containsKey(item.image)
                      ? Image.memory(
                    imageBytesMap[item.image]!,
                    width: 100, // Slightly smaller than the favorite card
                    height: 100,
                    fit: BoxFit.cover,
                  )
                      : const Icon(Icons.broken_image, size: 80),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(item.name,
                          style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: AppColors.black)),
                      const SizedBox(height: 4),
                      Text(item.desc,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10,
                            color: Colors.black87,
                            height: 1.2,
                          )),
                      const SizedBox(height: 6),
                      Text(
                        'Rp ${item.price.toString().replaceAllMapped(RegExp(r'(\d)(?=(\d{3})+(?!\d))'), (m) => '${m[1]}.')}',
                        style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            color: AppColors.red),
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

  Widget _buildSearchResultsSection() {
    if (!_isSearching) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Search Results for "$_searchQuery"',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              GestureDetector(
                onTap: () {
                  setState(() {
                    _isSearching = false;
                    _searchResults = [];
                    _searchQuery = '';
                  });
                },
                child: const Text(
                  'Clear',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.red,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
        _searchResults.isEmpty
            ? const Center(
          child: Padding(
            padding: EdgeInsets.all(20.0),
            child: Text(
              'No results found',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
          ),
        )
            : Column(
          children: _searchResults.map(_buildFavoriteCard).toList(),
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.whiteBG,
      appBar: AppBar(
        title: const Text('HomePage'),
        backgroundColor: AppColors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: SvgPicture.asset('assets/icons/chat_icon.svg', width: 24),
            onPressed: () async {
              final userId = await JwtUtils.getUserId();
              if (userId != null) {
                Navigator.push(context, MaterialPageRoute(builder: (_) => ChatPage(userId: userId)));
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('You must login first!')));
              }
            },
          ),
          IconButton(
            icon: SvgPicture.asset('assets/icons/chatbot_icon.svg', width: 24),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatbotPage()));
            },
          ),
          IconButton(
            icon: SvgPicture.asset('assets/icons/notification.svg', width: 24),
            onPressed: () {
              print('Notification icon clicked');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            CustomSearchBar(onSearch: _search),

            // Search Results Section (only visible when searching)
            _buildSearchResultsSection(),

            // Only show regular content when not searching
            if (!_isSearching) ...[
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Your trusted picks!',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(context,
                          MaterialPageRoute(builder: (_) => const MenuPage()));
                    },
                    child: const Text(
                      'View All',
                      style: TextStyle(fontSize: 12, color: AppColors.black),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 180, // Changed from 250 to match the card height
                child: _isLoadingMenus
                    ? const Center(child: CircularProgressIndicator())
                    : ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: allMenus.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 16),
                  itemBuilder: (context, index) =>
                      _buildMenuPreviewCard(allMenus[index]),
                ),
              ),
              const SizedBox(height: 20),
              const Text('Recommendation',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              _isLoadingFavorites
                  ? const Center(child: CircularProgressIndicator())
                  : favorites.isEmpty
                  ? const Text('No favorite menus found.')
                  : Column(children: favorites.map(_buildFavoriteCard).toList()),
            ],
          ],
        ),
      ),
    );
  }
}
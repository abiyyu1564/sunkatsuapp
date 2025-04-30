import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/widgets/menu_item_card_big.dart';
import 'package:sunkatsu_mobile/widgets/menu_item_card_small.dart';
import 'package:sunkatsu_mobile/widgets/nav_bar.dart';
import 'package:sunkatsu_mobile/widgets/search_bar.dart';
import 'package:sunkatsu_mobile/views/chat_page.dart';
import 'package:sunkatsu_mobile/views/chatbot_page.dart';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'package:sunkatsu_mobile/views/menu_page.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;
  List<String> _searchResults = [];
  List<String> _dummyData = List.generate(
    10,
        (index) => 'Search result $index',
  );

  void _search(String query) {
    setState(() {
      _searchResults = _dummyData
          .where((item) => item.toLowerCase().contains(query.toLowerCase()))
          .toList();
    });
  }

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
        title: const Text('HomePage'),
        backgroundColor: AppColors.white,
        elevation: 0,
        actions: [
          // Button 1: Chat
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: IconButton(
              icon: SvgPicture.asset(
                'assets/icons/chat_icon.svg',
                width: 24,
                height: 24,
              ),
              onPressed: () async {
                final userId = await JwtUtils.getUserId();
                if (userId != null) {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ChatPage(userId: userId),
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('You must login first!')),
                  );
                }
              },
            ),
          ),
          // Button 2: Chatbot
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: IconButton(
              icon: SvgPicture.asset(
                'assets/icons/chatbot_icon.svg',
                width: 24,
                height: 24,
              ),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const ChatbotPage(),
                  ),
                );
              },
            ),
          ),
          // Button 3: Notification
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 6),
            child: IconButton(
              icon: SvgPicture.asset(
                'assets/icons/notification.svg',
                width: 24,
                height: 24,
              ),
              onPressed: () {
                print('Notification icon clicked');
              },
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
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
                  const Text(
                    'Your trusted picks!',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const MenuPage()),
                      );
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
                height: 220,
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
                      desc: 'Tasty and crispy! Tasty and crispy! Tasty and crispy!',
                      price: 25000,
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'Recommendation',
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 16),
              SizedBox(
                height: 380,
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
                      desc: 'Tasty and crispy! Tasty and crispy! Tasty and crispy!',
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
        currentIndex: _currentIndex,
        onTap: _onNavbarTapped,
      ),
    );
  }
}

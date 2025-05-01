import 'package:flutter/material.dart';
import 'package:sunkatsu_mobile/utils/constants.dart'; // Assuming AppColors are defined here
import 'package:sunkatsu_mobile/widgets/nav_bar.dart';
import 'package:intl/intl.dart';
class StaffOrderPage extends StatefulWidget {
  const StaffOrderPage({super.key});

  @override
  State<StaffOrderPage> createState() => _StaffOrderPageState();
}
class _StaffOrderPageState extends State<StaffOrderPage> {
  int _currentIndex = 0;
  int _currentTabIndex = 0;
  final List<Map<String, String>> orders = [
    {
      'date': '15 March 2025',
      'status': 'Incoming',
      'items': '1x Chicken Katsu\n1x Ice Tea\n1x Chicken Katsu',
      'buttonText': 'Accept',
      'buttonColor': 'transparent',
    },
    {
      'date': '10 March 2025',
      'status': 'On Going',
      'items': '2x Chicken Katsu\n2x Ice Tea',
      'buttonText': 'Finish',
      'buttonColor': 'green',
    },
    {
      'date': '10 March 2025',
      'status': 'Rejected',
      'items': '2x Chicken Katsu\n2x Ice Tea',
      'buttonText': 'Reject',
      'buttonColor': 'red',
    },
  ];
  void _onNavbarTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: AppColors.white, // Assuming you have AppColors defined
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 24, 24, 100),
          child: Column(
            children: [
              // Tab buttons
              SafeArea(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildTabButton('All', 0),
                    _buildTabButton('Proceed', 1),
                    _buildTabButton('Rejected', 2),
                    _buildTabButton('Finished', 3),
                  ],
                ),
              ),
              SizedBox(height: 18),
              // Orders List
              ListView.builder(
                shrinkWrap:
                    true, // Allow ListView to take as much space as it needs
                physics:
                    NeverScrollableScrollPhysics(), // Disable internal scrolling
                itemCount: orders.length,
                itemBuilder: (context, index) {
                  final order = orders[index];
                  return Card(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                    color:
                        order['status'] == 'On Going'
                            ? AppColors.black
                            : order['status'] == 'Rejected'
                            ? AppColors.red
                            : AppColors.black,
                    child: Padding(
                      padding: const EdgeInsets.all(10.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Text(
                            order['date']!,
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppColors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(width: 10),
                          Container(
                            height: 100,
                            width: 1,
                            color: AppColors.white,
                          ),
                          SizedBox(width: 10),
                          Text(
                            'Orders:\n${order['items']}',
                            style: const TextStyle(
                              fontSize: 14,
                              color: AppColors.white,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Column(
                            children: [
                              Text(
                                '\n${order['status']}',
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: AppColors.white,
                                ),
                              ),
                              SizedBox(height: 10),
                              if (order['buttonText']!.isNotEmpty)
                                ElevatedButton(
                                  onPressed: () {},
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: order['buttonColor'] == 'transparent'
                                        ? Colors.transparent
                                        : order['buttonColor'] == 'red'
                                        ? Colors.red
                                        : order ['buttonColor'] == 'green'
                                        ? Colors.green
                                        : Colors.black,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                  ),
                                  child: Text(
                                    style: TextStyle(color: AppColors.white),
                                      order['buttonText']!
                                  ),
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
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

  Widget _buildTabButton(String title, int index) {
    return TextButton(
      onPressed: () {
        setState(() {
          _currentTabIndex = index; // Updates the selected tab index
        });
      },
      style: TextButton.styleFrom(
        minimumSize: Size(75, 30), // Adjust size of the tab button
        side: BorderSide(
          color:
              _currentTabIndex == index
                  ? AppColors.black
                  : AppColors.black.withAlpha(65),
          width: 1,
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
        backgroundColor:
            _currentTabIndex == index ? AppColors.red : Colors.transparent,
      ),
      child: Text(
        title,
        style: TextStyle(
          color: _currentTabIndex == index ? AppColors.white : AppColors.black,
          fontWeight:
              _currentTabIndex == index ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }
}

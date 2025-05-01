import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';

class NotificationPage extends StatefulWidget {
  const NotificationPage({super.key});

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  // Sample notifications data to match the image
  final List<Map<String, dynamic>> notifications = [
    {
      'message': 'Your order has been placed',
      'timestamp': DateTime.now().subtract(const Duration(minutes: 1)),
      'status': 'placed',
    },
    {
      'message': 'Your order has been completed',
      'timestamp': DateTime(2025, 3, 11, 11, 0),
      'status': 'completed',
    },
    {
      'message': 'Your order has been placed',
      'timestamp': DateTime(2025, 3, 11, 10, 20),
      'status': 'placed',
    },
    {
      'message': 'Your order has been completed',
      'timestamp': DateTime(2025, 3, 10, 19, 0),
      'status': 'completed',
    },
    {
      'message': 'Your order has been placed',
      'timestamp': DateTime(2025, 3, 10, 18, 55),
      'status': 'placed',
    },
  ];

  bool showNotifications = true;

  void _clearAllNotifications() {
    setState(() {
      showNotifications = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Group notifications by date
    Map<String, List<Map<String, dynamic>>> groupedNotifications = {};

    if (showNotifications) {
      for (var notification in notifications) {
        final timestamp = notification['timestamp'] as DateTime;
        final date = DateFormat('d MMMM yyyy').format(timestamp);

        if (DateFormat('d MMMM yyyy').format(DateTime.now()) == date) {
          // If the notification is from today
          if (!groupedNotifications.containsKey('Today')) {
            groupedNotifications['Today'] = [];
          }
          groupedNotifications['Today']!.add(notification);
        } else {
          // For other dates
          if (!groupedNotifications.containsKey(date)) {
            groupedNotifications[date] = [];
          }
          groupedNotifications[date]!.add(notification);
        }
      }
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: TextButton(
              onPressed: _clearAllNotifications,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.grey[400],
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text(
                  'Clear All',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ),
        ],
      ),
      body:
          !showNotifications
              ? const Center(
                child: Text(
                  'No notification in this moment',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              )
              : ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: groupedNotifications.length,
                itemBuilder: (context, index) {
                  final date = groupedNotifications.keys.elementAt(index);
                  final dateNotifications = groupedNotifications[date]!;

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8.0, top: 16.0),
                        child: Text(
                          date,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                      ),
                      ...dateNotifications.map((notification) {
                        return _buildNotificationCard(notification);
                      }).toList(),
                    ],
                  );
                },
              ),
    );
  }

  Widget _buildNotificationCard(Map<String, dynamic> notification) {
    final timestamp = notification['timestamp'] as DateTime;
    final status = notification['status'] as String;

    // Determine background color based on status and recency
    Color backgroundColor;
    if (status == 'placed' &&
        DateTime.now().difference(timestamp).inHours < 1) {
      backgroundColor = AppColors.red;
    } else {
      backgroundColor = AppColors.black;
    }

    // Format time
    String formattedTime;
    if (DateTime.now().difference(timestamp).inMinutes < 60) {
      formattedTime = 'A minute ago';
    } else {
      formattedTime = DateFormat('hh:mm a').format(timestamp);
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              notification['message'] as String,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              formattedTime,
              style: const TextStyle(color: Colors.white70, fontSize: 14),
            ),
          ],
        ),
      ),
    );
  }
}

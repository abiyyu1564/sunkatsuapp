import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
// Tambahkan import berikut di bagian atas file
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class NotificationPage extends StatefulWidget {
  const NotificationPage({super.key});

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  // Ubah variabel notifications menjadi:
  List<Map<String, dynamic>> notifications = [];
  bool isLoading = true;

  // Ubah initState menjadi:
  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

// Tambahkan fungsi ini di dalam class _NotificationPageState
  Future<void> _loadNotifications() async {
    setState(() {
      isLoading = true;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final notificationsJson = prefs.getString('notifications') ?? '[]';
      final loadedNotifications = List<Map<String, dynamic>>.from(
        jsonDecode(notificationsJson),
      );
      
      // Langsung gunakan notifikasi yang tersimpan, tanpa data contoh
      notifications = loadedNotifications;

      // Urutkan notifikasi berdasarkan waktu (terbaru di atas)
      notifications.sort((a, b) {
        final aTime = DateTime.parse(a['timestamp'] as String);
        final bTime = DateTime.parse(b['timestamp'] as String);
        return bTime.compareTo(aTime);
      });
    } catch (e) {
      debugPrint('Error loading notifications: $e');
    }

    setState(() {
      isLoading = false;
    });
  }

// Ubah fungsi _clearAllNotifications menjadi:
  void _clearAllNotifications() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('notifications');
      
      setState(() {
        notifications.clear();
      });
    } catch (e) {
      debugPrint('Error clearing notifications: $e');
    }
  }

// Ubah awal fungsi build menjadi:
  @override
  Widget build(BuildContext context) {
    // Group notifications by date
    Map<String, List<Map<String, dynamic>>> groupedNotifications = {};
    
    if (!isLoading && notifications.isNotEmpty) {
      for (var notification in notifications) {
        final timestamp = DateTime.parse(notification['timestamp'] as String);
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
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
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
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : notifications.isEmpty
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

// Ubah fungsi _buildNotificationCard menjadi:
  Widget _buildNotificationCard(Map<String, dynamic> notification) {
    final timestamp = DateTime.parse(notification['timestamp'] as String);
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
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

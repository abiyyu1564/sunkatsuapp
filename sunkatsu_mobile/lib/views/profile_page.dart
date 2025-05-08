import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/views/login_page.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({Key? key}) : super(key: key);

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final _storage = const FlutterSecureStorage();
  String username = '';

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    // You can load user data from secure storage or API
    // For now, we'll just use a placeholder
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      username = prefs.getString('remembered_username') ?? 'User';
    });
  }

  Future<void> _logout() async {
    // Show confirmation dialog
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Logout', style: TextStyle(color: AppColors.red)),
          ),
        ],
      ),
    );

    if (shouldLogout != true) return;

    // Clear token and other secure data
    await _storage.delete(key: 'token');

    // Optionally clear remembered username if you want to force login again
    // final prefs = await SharedPreferences.getInstance();
    // await prefs.remove('remembered_username');

    if (!mounted) return;

    // Show success message
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Logged out successfully')),
    );

    // Navigate to login page and clear navigation stack
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => const LoginPage()),
          (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: AppColors.red,
        foregroundColor: AppColors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Profile header
            Center(
              child: Column(
                children: [
                  const CircleAvatar(
                    radius: 50,
                    backgroundColor: AppColors.red,
                    child: Icon(
                      Icons.person,
                      size: 50,
                      color: AppColors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    username,
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),

            // const SizedBox(height: 32),
            //
            // // Profile options
            // const Text(
            //   'Account Settings',
            //   style: TextStyle(
            //     fontSize: 18,
            //     fontWeight: FontWeight.bold,
            //   ),
            // ),
            // const SizedBox(height: 8),
            //
            // _buildProfileOption(
            //   icon: Icons.person_outline,
            //   title: 'Edit Profile',
            //   onTap: () {
            //     // Navigate to edit profile page
            //   },
            // ),
            //
            // _buildProfileOption(
            //   icon: Icons.location_on_outlined,
            //   title: 'Delivery Addresses',
            //   onTap: () {
            //     // Navigate to addresses page
            //   },
            // ),
            //
            // _buildProfileOption(
            //   icon: Icons.payment_outlined,
            //   title: 'Payment Methods',
            //   onTap: () {
            //     // Navigate to payment methods page
            //   },
            // ),
            //
            // _buildProfileOption(
            //   icon: Icons.notifications_outlined,
            //   title: 'Notifications',
            //   onTap: () {
            //     // Navigate to notifications settings
            //   },
            // ),
            //
            // const SizedBox(height: 32),
            //
            // // Support section
            // const Text(
            //   'Support',
            //   style: TextStyle(
            //     fontSize: 18,
            //     fontWeight: FontWeight.bold,
            //   ),
            // ),
            // const SizedBox(height: 8),
            //
            // _buildProfileOption(
            //   icon: Icons.help_outline,
            //   title: 'Help Center',
            //   onTap: () {
            //     // Navigate to help center
            //   },
            // ),
            //
            // _buildProfileOption(
            //   icon: Icons.info_outline,
            //   title: 'About Us',
            //   onTap: () {
            //     // Navigate to about page
            //   },
            // ),

            const SizedBox(height: 32),

            // Logout button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _logout,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.red,
                  foregroundColor: AppColors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text(
                  'Logout',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileOption({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: AppColors.red),
      title: Text(title),
      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
      contentPadding: EdgeInsets.zero,
    );
  }
}
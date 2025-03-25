import 'package:flutter/material.dart';
import '../utils/constants.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Center(
        child: Text(
          'Login Page (Coming Soon)',
          style: TextStyle(
            fontSize: 18,
            color: AppColors.black.withOpacity(0.7),
          ),
        ),
      ),
    );
  }
}

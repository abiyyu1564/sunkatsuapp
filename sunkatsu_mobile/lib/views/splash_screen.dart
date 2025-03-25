import 'dart:async';
import 'package:flutter/material.dart';
import '../utils/constants.dart';
import 'login_page.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with TickerProviderStateMixin {
  late AnimationController _logoController;
  late Animation<double> _logoScale;

  late AnimationController _sloganController;
  late Animation<double> _sloganOpacity;

  @override
  void initState() {
    super.initState();

    _logoController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _logoScale = CurvedAnimation(parent: _logoController, curve: Curves.easeOutBack);

    _sloganController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _sloganOpacity = CurvedAnimation(parent: _sloganController, curve: Curves.easeIn);

    _logoController.forward().then((_) {
      _sloganController.forward();
      Timer(const Duration(seconds: 2), () {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginPage()),
        );
      });
    });
  }

  @override
  void dispose() {
    _logoController.dispose();
    _sloganController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset('assets/logo.png', width: 120),
            const SizedBox(height: 24),
            ScaleTransition(
              scale: _logoScale,
              child: const Text(
                "SUNKATSU",
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: AppColors.red,
                  letterSpacing: 2,
                ),
              ),
            ),
            const SizedBox(height: 12),
            FadeTransition(
              opacity: _sloganOpacity,
              child: const Text(
                "Oriental Chicken Katsu",
                style: TextStyle(
                  fontSize: 16,
                  fontStyle: FontStyle.italic,
                  color: AppColors.black,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

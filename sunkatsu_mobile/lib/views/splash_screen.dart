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
  // Single controller for the text animations with longer duration
  late AnimationController _textAnimationController;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _scaleAnimation;

  // Controllers for fade animations
  late AnimationController _logoController;
  late Animation<double> _logoOpacity;

  late AnimationController _sloganController;
  late Animation<double> _sloganOpacity;

  @override
  void initState() {
    super.initState();


    _textAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );


    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 1.5),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _textAnimationController,
      // First 60% of the animation
      curve: const Interval(0.0, 0.6, curve: Curves.easeOutCubic),
    ));

    _scaleAnimation = TweenSequence<double>([
      TweenSequenceItem(
        tween: Tween<double>(begin: 36, end: 36),
        weight: 60,
      ),
      TweenSequenceItem(
        tween: Tween<double>(begin: 36, end: 72)
            .chain(CurveTween(curve: Curves.easeOutBack)),
        weight: 40,
      ),
    ]).animate(_textAnimationController);

    // Logo fade animation
    _logoController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _logoOpacity = CurvedAnimation(
      parent: _logoController,
      curve: Curves.easeIn,
    );

    // Slogan fade animation
    _sloganController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _sloganOpacity = CurvedAnimation(
      parent: _sloganController,
      curve: Curves.easeIn,
    );

    _startAnimationSequence();
  }

  Future<void> _startAnimationSequence() async {
    // Start the text animation
    _textAnimationController.forward();

    // Wait for the slide to complete before showing the logo
    await Future.delayed(const Duration(milliseconds: 800));

    // Start logo fade in
    _logoController.forward();

    // Wait a bit before showing the slogan
    await Future.delayed(const Duration(milliseconds: 300));

    // Start slogan fade in
    _sloganController.forward();

    // After all animations complete, move to login
    await Future.delayed(const Duration(milliseconds: 1500));
    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const LoginPage()),
      );
    }
  }

  @override
  void dispose() {
    _textAnimationController.dispose();
    _logoController.dispose();
    _sloganController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Center(
        child: AnimatedBuilder(
          animation: Listenable.merge([
            _textAnimationController,
            _logoController,
            _sloganController,
          ]),
          builder: (context, _) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Text with combined slide and scale animations
                SlideTransition(
                  position: _slideAnimation,
                  child: Text(
                    "Sunkatsu",
                    style: TextStyle(
                      fontFamily: 'Montserrat',
                      fontWeight: FontWeight.bold,
                      fontSize: _scaleAnimation.value,
                      color: AppColors.red,
                      letterSpacing: 1.5,
                      // Add a subtle shadow for better visibility
                      shadows: [
                        Shadow(
                          color: AppColors.black.withOpacity(0.2),
                          offset: const Offset(1, 1),
                          blurRadius: 2,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                // Logo with fade animation
                FadeTransition(
                  opacity: _logoOpacity,
                  child: Image.asset(
                    'assets/logo.png',
                    width: 120,
                  ),
                ),
                const SizedBox(height: 16),
                // Slogan with fade animation
                FadeTransition(
                  opacity: _sloganOpacity,
                  child: const Text(
                    "Oriental Chicken Katsu",
                    style: TextStyle(
                      fontSize: 24,
                      fontStyle: FontStyle.italic,
                      color: AppColors.black,
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}


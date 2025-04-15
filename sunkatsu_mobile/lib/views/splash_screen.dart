import 'package:flutter/material.dart';
import 'dart:async';

import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/views/welcome_page.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _textController;
  late AnimationController _bgColorController;

  late Animation<double> _textOpacity;
  late Animation<Color?> _backgroundColor;

  late Animation<Offset> _textSlide;
  late Animation<Color?> _textColor;

  @override
  void initState() {
    super.initState();

    // Background color transition controller
    _bgColorController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _backgroundColor = ColorTween(
      begin: AppColors.red, // Start with red
      end: AppColors.whiteBG, // End with white
    ).animate(_bgColorController);

    // Text fade-in controller
    _textController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _textOpacity = Tween<double>(
      begin: 1,
      end: 1,
    ).animate(CurvedAnimation(
      parent: _textController,
      curve: const Cubic(0.25, 1, 0.5, 1),
    ));

    _textSlide = Tween<Offset>(
      begin: const Offset(0, 8),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _textController,
      curve: const Cubic(0.25, 1, 0.5, 1),
    ));

    _textColor = ColorTween(
      begin: AppColors.white,
      end: AppColors.red,
    ).animate(_bgColorController);

    _startSequence();
  }

  Future<void> _startSequence() async {
    // Wait a little before showing text
    await Future.delayed(const Duration(milliseconds: 800));
    _textController.forward();

    // Wait more, then start background color transition
    await Future.delayed(const Duration(milliseconds: 1000));
    _bgColorController.forward();

    // Then wait a bit before navigating to next screen
    await Future.delayed(const Duration(milliseconds: 1000));
    _navigateToWelcomePage();
  }

  void _navigateToWelcomePage() {
    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        transitionDuration: const Duration(milliseconds: 800),
        pageBuilder: (context, animation,
            secondaryAnimation) => const WelcomePage(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(
            opacity: animation,
            child: child,
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    _textController.dispose();
    _bgColorController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([_textController, _bgColorController]),
      builder: (context, child) {
        return Scaffold(
          backgroundColor: _backgroundColor.value,
          body: Center(
            child: SlideTransition(
              position: _textSlide,
              child: Opacity(
                opacity: _textOpacity.value,
                child: Text(
                  'Sunkatsu',
                  style: TextStyle(
                    fontFamily: 'Montserrat',
                    fontSize: 60,
                    fontWeight: FontWeight.bold,
                    color: _textColor.value,
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

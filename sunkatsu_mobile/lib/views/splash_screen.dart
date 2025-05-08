import 'package:flutter/material.dart';
import 'dart:async';
import 'package:sunkatsu_mobile/navigation/main_navigation.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'package:sunkatsu_mobile/views/welcome_page.dart';
import 'package:dart_jsonwebtoken/dart_jsonwebtoken.dart';

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

    _bgColorController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _backgroundColor = ColorTween(
      begin: AppColors.red,
      end: AppColors.whiteBG,
    ).animate(_bgColorController);

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
    await Future.delayed(const Duration(milliseconds: 800));
    _textController.forward();

    await Future.delayed(const Duration(milliseconds: 1000));
    _bgColorController.forward();

    await Future.delayed(const Duration(milliseconds: 1000));
    _checkTokenAndNavigate();
  }

  Future<void> _checkTokenAndNavigate() async {
    final token = await JwtUtils.getToken();

    bool isValid = false;

    if (token != null) {
      try {
        final jwt = JWT.decode(token);
        final exp = jwt.payload['exp'];
        final now = DateTime.now().millisecondsSinceEpoch ~/ 1000;
        if (exp != null && now < exp) {
          isValid = true;
        }
      } catch (e) {
        isValid = false;
      }
    }

    if (!context.mounted) return;

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => isValid ? const MainNavigation() : const WelcomePage(),
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
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../utils/jwt_utils.dart';

class SecureImageLoader extends StatefulWidget {
  final String imageUrl;
  final double width;
  final double height;

  const SecureImageLoader({
    Key? key,
    required this.imageUrl,
    this.width = 200,
    this.height = 200,
  }) : super(key: key);

  @override
  State<SecureImageLoader> createState() => _SecureImageLoaderState();
}

class _SecureImageLoaderState extends State<SecureImageLoader> {
  Uint8List? imageData;
  bool error = false;

  @override
  void initState() {
    super.initState();
    _loadImage();
  }

  Future<void> _loadImage() async {
    try {
      final token = await JwtUtils.getToken();
      final uri = Uri.parse("http://10.0.2.2:8080${widget.imageUrl}");

      final response = await http.get(uri, headers: {
        'Authorization': 'Bearer $token',
      });

      if (response.statusCode == 200) {
        setState(() {
          imageData = response.bodyBytes;
        });
      } else {
        print("Failed to load image. Status code: ${response.statusCode}");
        setState(() {
          error = true;
        });
      }
    } catch (e) {
      print("Error fetching image: $e");
      setState(() {
        error = true;
      });
    }
  }

  void _openImageViewer(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => Dialog(
        backgroundColor: Colors.black,
        insetPadding: EdgeInsets.zero,
        child: InteractiveViewer(
          panEnabled: true,
          minScale: 0.5,
          maxScale: 4.0,
          child: Center(
            child: Image.memory(
              imageData!,
              fit: BoxFit.contain,
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (error) {
      return const Text(
        'Image failed to load',
        style: TextStyle(color: Colors.red),
      );
    }

    if (imageData == null) {
      return const CircularProgressIndicator();
    }

    return GestureDetector(
      onTap: () => _openImageViewer(context),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Image.memory(
          imageData!,
          width: widget.width,
          height: widget.height,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}

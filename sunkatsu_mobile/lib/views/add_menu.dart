import 'package:flutter/material.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'package:http_parser/http_parser.dart'; //
import 'package:mime/mime.dart'; //

class AddMenuPage extends StatefulWidget {
  const AddMenuPage({super.key});

  @override
  State<AddMenuPage> createState() => _AddMenuPageState();
}

class _AddMenuPageState extends State<AddMenuPage> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController priceController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController imageController = TextEditingController();

  String selectedCategory = '';
  File? selectedImage;
  bool isProcessingImage = false;
  bool isSubmitting = false;

  final ImagePicker _picker = ImagePicker();

  @override
  void dispose() {
    nameController.dispose();
    priceController.dispose();
    descriptionController.dispose();
    imageController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        setState(() {
          selectedImage = File(image.path);
          imageController.text = image.name; // Update the image name in the text field
          isProcessingImage = true;
        });

        // Simulate background removal process
        await Future.delayed(const Duration(seconds: 2));

        // In a real app, you would call your background removal API here
        // For example:
        // await _removeBackground(selectedImage!);

        setState(() {
          isProcessingImage = false;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Background removed successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        isProcessingImage = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error picking image: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _pickImageFromCamera() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.camera);
      if (image != null) {
        setState(() {
          selectedImage = File(image.path);
          imageController.text = image.name; // Update the image name in the text field
          isProcessingImage = true;
        });

        // Simulate background removal process
        await Future.delayed(const Duration(seconds: 2));

        setState(() {
          isProcessingImage = false;
        });


      }
    } catch (e) {
      setState(() {
        isProcessingImage = false;
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error picking image: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showImagePickerOptions() {
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Wrap(
            children: <Widget>[
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Photo Library'),
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImage();
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text('Camera'),
                onTap: () {
                  Navigator.of(context).pop();
                  _pickImageFromCamera();
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _submitMenu() async {
    // Validate inputs
    if (nameController.text.isEmpty ||
        priceController.text.isEmpty ||
        descriptionController.text.isEmpty ||
        selectedCategory.isEmpty ||
        selectedImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill all required fields and select an image'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      isSubmitting = true;
    });

    try {
      // Get token from shared preferences
      final prefs = await SharedPreferences.getInstance();
      final token = await JwtUtils.getToken();

      // Create multipart request
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('http://localhost:8080/api/menus'),
      );

      // Add headers
      request.headers.addAll({
        'Authorization': 'Bearer $token',
      });

      // Add file
      final mimeType = lookupMimeType(selectedImage!.path);
      if (mimeType != 'image/jpeg' && mimeType != 'image/png') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('File harus berupa gambar .jpg/.jpeg atau .png'),
            backgroundColor: Colors.red,
          ),
        );
        setState(() {
          isSubmitting = false;
        });
        return;
      }

      request.files.add(
        await http.MultipartFile.fromPath(
          'file',
          selectedImage!.path,
          contentType: MediaType.parse(mimeType!),
        ),
      );

      // Add fields
      request.fields.addAll({
        'name': nameController.text,
        'desc': descriptionController.text,
        'price': priceController.text,
        'category': selectedCategory,
        'nums_bought': '0',
      });

      // Send request
      var response = await request.send();
      var responseData = await response.stream.bytesToString();

      if (response.statusCode == 200 || response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Menu created successfully!'),
            backgroundColor: Colors.green,
          ),
        );

        // Reset form
        setState(() {
          nameController.clear();
          priceController.clear();
          descriptionController.clear();
          imageController.clear();
          selectedCategory = '';
          selectedImage = null;
        });

        // Return to MenuPage with refresh flag
        Navigator.of(context).pop(true); // Return true to indicate success and trigger refresh
      } else {
        throw Exception('Failed to create menu: ${response.statusCode}, $responseData');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error creating menu: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        isSubmitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Red background for top section
          Container(
            height: MediaQuery.of(context).size.height * 0.4,
            color: const Color(0xFFE15B5B),
          ),

          // White curved container
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              height: MediaQuery.of(context).size.height * 0.7,
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(30),
                  topRight: Radius.circular(30),
                ),
              ),
            ),
          ),

          // Content
          SafeArea(
            child: Column(
              children: [
                // Back button
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Align(
                    alignment: Alignment.topLeft,
                    child: GestureDetector(
                      onTap: () {
                        Navigator.pop(context);
                      },
                      child: const Icon(
                        Icons.arrow_back,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),

                // Scrollable content
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        const SizedBox(height: 20),

                        // Image placeholder or selected image
                        GestureDetector(
                          onTap: isProcessingImage ? null : _showImagePickerOptions,
                          child: Center(
                            child: Container(
                              width: 200,
                              height: 200,
                              decoration: BoxDecoration(
                                color: Colors.grey[200],
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.1),
                                    spreadRadius: 2,
                                    blurRadius: 10,
                                    offset: const Offset(0, 5),
                                  ),
                                ],
                              ),
                              child: isProcessingImage
                                  ? const Center(
                                child: CircularProgressIndicator(
                                  color: Color(0xFFE15B5B),
                                ),
                              )
                                  : selectedImage != null
                                  ? ClipOval(
                                child: Image.file(
                                  selectedImage!,
                                  fit: BoxFit.cover,
                                  width: 200,
                                  height: 200,
                                ),
                              )
                                  : Center(
                                child: Icon(
                                  Icons.add_photo_alternate_outlined,
                                  size: 80,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ),
                          ),
                        ),

                        // Form fields
                        Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Menu name
                              _buildFormField('Menu name', nameController, 'Enter menu name'),
                              const SizedBox(height: 16),

                              // Menu category (dropdown)
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Menu category',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Container(
                                    decoration: BoxDecoration(
                                      border: Border(
                                        bottom: BorderSide(
                                          color: Colors.grey[300]!,
                                          width: 1,
                                        ),
                                      ),
                                    ),
                                    child: DropdownButtonHideUnderline(
                                      child: DropdownButton<String>(
                                        isExpanded: true,
                                        hint: Text(
                                          'Select categories',
                                          style: TextStyle(
                                            color: Colors.grey[400],
                                            fontSize: 16,
                                          ),
                                        ),
                                        value: selectedCategory.isEmpty ? null : selectedCategory,
                                        onChanged: (String? newValue) {
                                          setState(() {
                                            selectedCategory = newValue!;
                                          });
                                        },
                                        items: <String>['Food', 'Drink', 'Dessert']
                                            .map<DropdownMenuItem<String>>((String value) {
                                          return DropdownMenuItem<String>(
                                            value: value.toLowerCase(),
                                            child: Text(value),
                                          );
                                        }).toList(),
                                      ),
                                    ),
                                  ),
                                ],
                              ),

                              const SizedBox(height: 16),

                              // Menu price
                              _buildFormField('Menu price', priceController, 'Enter a price', isNumber: true),
                              const SizedBox(height: 16),

                              // Menu description
                              _buildFormField('Menu description', descriptionController, 'Write description'),



                              // Divider
                              const Padding(
                                padding: EdgeInsets.symmetric(vertical: 10),
                                child: Divider(
                                  color: Colors.white,
                                  thickness: 1,
                                  height: 1,

                                ),
                              ),

                              // Action buttons
                              Padding(
                                padding: const EdgeInsets.only(bottom: 16.0),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                  children: [
                                    // Discard button
                                    Expanded(
                                      child: OutlinedButton(
                                        onPressed: isSubmitting ? null : () {
                                          Navigator.pop(context);
                                        },
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor: Colors.black,
                                          backgroundColor: Colors.white,
                                          side: BorderSide(color: Colors.grey[300]!),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(30),
                                          ),
                                          padding: const EdgeInsets.symmetric(
                                            vertical: 16,
                                          ),
                                        ),
                                        child: const Padding(
                                          padding: EdgeInsets.symmetric(horizontal: 0),
                                          child: Text(
                                            'Discard Change',
                                            style: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),

                                    const SizedBox(width: 16),

                                    // Save button
                                    Expanded(
                                      child: ElevatedButton(
                                        onPressed: isSubmitting || isProcessingImage ? null : _submitMenu,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.black,
                                          foregroundColor: Colors.white,
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(30),
                                          ),
                                          padding: const EdgeInsets.symmetric(
                                            vertical: 16,
                                          ),
                                        ),
                                        child: Text(
                                          isSubmitting ? 'Submitting...' : 'Save Change',
                                          style: const TextStyle(
                                            fontSize: 16,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormField(String label, TextEditingController controller, String hintText, {bool isNumber = false, bool readOnly = false}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey[600],
          ),
        ),
        const SizedBox(height: 4),
        Container(
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: Colors.grey[300]!,
                width: 1,
              ),
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: controller,
                  keyboardType: isNumber ? TextInputType.number : TextInputType.text,
                  readOnly: readOnly,
                  decoration: InputDecoration(
                    hintText: hintText,
                    hintStyle: TextStyle(
                      color: Colors.grey[400],
                      fontSize: 16,
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                  style: const TextStyle(
                    fontSize: 16,
                  ),
                ),
              ),
              GestureDetector(
                onTap: () {
                  // Edit field
                  if (label == 'Menu image') {
                    _showImagePickerOptions();
                  }
                },
                child: Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Image.network(
                    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HeNNMtyGA0p13lPZtc9lNuVtND3Uxh.png',
                    width: 16,
                    height: 16,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

import 'package:flutter/material.dart';

class AddMenuPage extends StatefulWidget {
  const AddMenuPage({super.key});

  @override
  State<AddMenuPage> createState() => _AddMenuPageState();
}

class _AddMenuPageState extends State<AddMenuPage> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController categoryController = TextEditingController();
  final TextEditingController priceController = TextEditingController();
  final TextEditingController descriptionController = TextEditingController();
  final TextEditingController imageController = TextEditingController();

  @override
  void dispose() {
    nameController.dispose();
    categoryController.dispose();
    priceController.dispose();
    descriptionController.dispose();
    imageController.dispose();
    super.dispose();
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
                      child: const Icon(Icons.arrow_back, color: Colors.white),
                    ),
                  ),
                ),

                const SizedBox(height: 29),

                // Image placeholder
                Center(
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
                    child: Center(
                      child: Icon(
                        Icons.add_photo_alternate_outlined,
                        size: 80,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                ),

                // Form fields
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Form fields
                        _buildFormField(
                          'Menu name',
                          nameController,
                          'Enter menu name',
                        ),
                        const SizedBox(height: 16),
                        _buildFormField(
                          'Menu category',
                          categoryController,
                          'Select categories',
                        ),
                        const SizedBox(height: 16),
                        _buildFormField(
                          'Menu price',
                          priceController,
                          'Enter a price',
                        ),
                        const SizedBox(height: 16),
                        _buildFormField(
                          'Menu description',
                          descriptionController,
                          'Write description',
                        ),
                        const SizedBox(height: 16),
                        _buildFormField(
                          'Menu image',
                          imageController,
                          'Select image',
                        ),

                        const Spacer(),

                        // Divider
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 16.0),
                          child: Divider(
                            color: Colors.grey,
                            thickness: 1,
                            height: 1,
                          ),
                        ),

                        // Action buttons - Only 2 buttons
                        Padding(
                          padding: const EdgeInsets.only(bottom: 16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              // Discard button
                              Expanded(
                                child: OutlinedButton(
                                  onPressed: () {
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
                                    padding: EdgeInsets.symmetric(
                                      horizontal: 0,
                                    ),
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

                              const SizedBox(
                                width: 16,
                              ), // Increased spacing between buttons
                              // Save button
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {
                                    _saveMenu(context);
                                  },
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
                                  child: const Text(
                                    'Save Change',
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

  Widget _buildFormField(
    String label,
    TextEditingController controller,
    String hintText,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 14, color: Colors.grey[600])),
        const SizedBox(height: 4),
        Container(
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(color: Colors.grey[300]!, width: 1),
            ),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: controller,
                  decoration: InputDecoration(
                    hintText: hintText,
                    hintStyle: TextStyle(color: Colors.grey[400], fontSize: 16),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                  style: const TextStyle(fontSize: 16),
                ),
              ),
              GestureDetector(
                onTap: () {
                  // Edit field
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

  void _saveMenu(BuildContext context) {
    // Validate inputs
    if (nameController.text.isEmpty ||
        categoryController.text.isEmpty ||
        priceController.text.isEmpty ||
        descriptionController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill all required fields'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Create menu object
    final newMenu = {
      'name': nameController.text,
      'category': categoryController.text,
      'price': priceController.text,
      'description': descriptionController.text,
      'image':
          imageController.text.isEmpty ? 'default.png' : imageController.text,
    };

    // Return to previous screen with new menu data
    Navigator.pop(context, newMenu);
  }
}

import 'package:flutter/material.dart';

class EditMenuPage extends StatefulWidget {
  final String initialName;
  final String initialCategory;
  final String initialPrice;
  final String initialDescription;
  final String initialImage;
  final String imageUrl;

  const EditMenuPage({
    super.key,
    this.initialName = 'Chicken Katsu',
    this.initialCategory = 'Food',
    this.initialPrice = '25.000',
    this.initialDescription = 'Lorem ipsum',
    this.initialImage = 'Katsu.png',
    this.imageUrl = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kLxFO8TEkLK0da8yBegS4hwRpqNbTT.png',
  });

  @override
  State<EditMenuPage> createState() => _EditMenuPageState();
}

class _EditMenuPageState extends State<EditMenuPage> {
  late TextEditingController nameController;
  late TextEditingController categoryController;
  late TextEditingController priceController;
  late TextEditingController descriptionController;
  late TextEditingController imageController;

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController(text: widget.initialName);
    categoryController = TextEditingController(text: widget.initialCategory);
    priceController = TextEditingController(text: widget.initialPrice);
    descriptionController = TextEditingController(text: widget.initialDescription);
    imageController = TextEditingController(text: widget.initialImage);
  }

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
                // Back button (optional)
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

                const SizedBox(height: 29),

                // Food image
                Center(
                  child: Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
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
                    child: ClipOval(
                      child: Image.network(
                        widget.imageUrl,
                        fit: BoxFit.cover,
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
                        _buildFormField('Menu name', nameController),
                        const SizedBox(height: 16),
                        _buildFormField('Menu category', categoryController),
                        const SizedBox(height: 16),
                        _buildFormField('Menu price', priceController),
                        const SizedBox(height: 16),
                        _buildFormField('Menu description', descriptionController),
                        const SizedBox(height: 16),
                        _buildFormField('Menu image', imageController),

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

                        // Action buttons - Updated to match the design
                        Padding(
                          padding: const EdgeInsets.only(bottom: 16.0),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              // Delete button
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {
                                    _showDeleteConfirmation(context);
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFFE15B5B),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(30),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 16,
                                    ),
                                  ),
                                  child: const Text(
                                    'Delete Menu',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),

                              const SizedBox(width: 8),

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
                                  child: Padding(
                                    padding: const EdgeInsets.symmetric(horizontal: 0), // tambahkan padding horizontal
                                    child: const Text(
                                      'Discard Change',
                                      style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              ),

                              const SizedBox(width: 8),

                              // Save button
                              Expanded(
                                child: ElevatedButton(
                                  onPressed: () {
                                    _saveChanges(context);
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

  Widget _buildFormField(String label, TextEditingController controller) {
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
                  decoration: const InputDecoration(
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.symmetric(vertical: 8),
                  ),
                  style: const TextStyle(
                    fontSize: 16,
                  ),
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

  void _showDeleteConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Menu'),
        content: const Text('Are you sure you want to delete this menu item?'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pop(context); // Go back to menu page
              // Add delete functionality here
            },
            child: const Text('Delete', style: TextStyle(color: Color(0xFFE15B5B))),
          ),
        ],
      ),
    );
  }

  void _saveChanges(BuildContext context) {
    // Implement save functionality
    // You can create a Menu model and pass the updated values back

    // Example:
    // final updatedMenu = Menu(
    //   name: nameController.text,
    //   category: categoryController.text,
    //   price: priceController.text,
    //   description: descriptionController.text,
    //   image: imageController.text,
    // );

    // Navigator.pop(context, updatedMenu);

    // For now, just go back
    Navigator.pop(context);
  }
}

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';

class EditMenuPage extends StatefulWidget {
  final Map<String, dynamic> foodData;

  const EditMenuPage({super.key, required this.foodData});

  @override
  State<EditMenuPage> createState() => _EditMenuPageState();
}

class _EditMenuPageState extends State<EditMenuPage> {
  late TextEditingController nameController;
  late TextEditingController priceController;
  late TextEditingController descriptionController;
  late TextEditingController imageController;
  String? imageToDisplay;
  File? imageFile;
  String selectedCategory = '';
  bool isProcessingImage = false;
  bool isSubmitting = false;
  bool isDeleting = false;

  final ImagePicker _picker = ImagePicker();

  // Fungsi pilih gambar dari galeri
  Future<void> _pickImage() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        setState(() {
          imageFile = File(image.path);
          imageController.text = image.name;
          isProcessingImage = true;
        });

        // Simulate background removal process
        await Future.delayed(const Duration(seconds: 1)); // Reduced delay

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
          backgroundColor: AppColors.red,
        ),
      );
    }
  }

  // Fungsi pilih gambar dari kamera
  Future<void> _pickImageFromCamera() async {
    try {
      final XFile? image = await _picker.pickImage(source: ImageSource.camera);
      if (image != null) {
        setState(() {
          imageFile = File(image.path);
          imageController.text = image.name;
          isProcessingImage = true;
        });

        // Simulate background removal process
        await Future.delayed(const Duration(seconds: 1)); // Reduced delay

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
          backgroundColor: AppColors.red,
        ),
      );
    }
  }

  // Fungsi untuk menampilkan opsi pilihan gambar
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

  // Fungsi Delete Menu
  Future<void> _deleteMenu() async {
    setState(() {
      isDeleting = true;
    });

    try {
      final token = await JwtUtils.getToken();
      if (token == null) {
        setState(() {
          isDeleting = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Authentication token not found'),
            backgroundColor: AppColors.red,
          ),
        );
        return;
      }

      final id = widget.foodData['id'];
      final response = await http.delete(
        Uri.parse('http://10.0.2.2:8080/api/menus/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        // Successful deletion
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Menu deleted successfully'),
            backgroundColor: Colors.green,
          ),
        );

        // Navigasi langsung ke MenuPage (pop semua halaman sampai ke MenuPage)
        Navigator.of(context).popUntil((route) {
          return route.settings.name == '/menu' || route.isFirst;
        });
      } else {
        // Failed deletion
        debugPrint('Delete failed with status: ${response.statusCode}');
        debugPrint('Response body: ${response.body}');

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to delete menu: ${response.statusCode}'),
            backgroundColor: AppColors.red,
          ),
        );
        setState(() {
          isDeleting = false;
        });
      }
    } catch (e) {
      debugPrint('Error deleting menu: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error deleting menu: $e'),
          backgroundColor: Colors.red,
        ),
      );
      setState(() {
        isDeleting = false;
      });
    }
  }

  // Fungsi Edit Menu
  Future<void> _saveChanges(BuildContext context) async {
    // Validate inputs
    if (nameController.text.isEmpty ||
        priceController.text.isEmpty ||
        descriptionController.text.isEmpty ||
        selectedCategory.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill all required fields'),
          backgroundColor: AppColors.red,
        ),
      );
      return;
    }

    setState(() {
      isSubmitting = true;
    });

    // Show loading overlay
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return const Dialog(
          child: Padding(
            padding: EdgeInsets.all(20.0),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircularProgressIndicator(),
                SizedBox(width: 20),
                Text("Saving changes..."),
              ],
            ),
          ),
        );
      },
    );

    final token = await JwtUtils.getToken();
    if (token == null) {
      if (context.mounted) {
        Navigator.pop(context); // Close loading dialog
        setState(() {
          isSubmitting = false;
        });
      }
      return;
    }

    final id = widget.foodData['id'];

    // Buat URI dengan query parameters
    final uri = Uri.parse('http://10.0.2.2:8080/api/menus/$id').replace(
      queryParameters: {
        'name': nameController.text,
        'price': priceController.text,
        'desc': descriptionController.text,
        'category': selectedCategory,
        'nums_bought': (widget.foodData['nums_bought'] ?? 0).toString(),
      },
    );

    try {
      final request = http.MultipartRequest('PUT', uri)
        ..headers['Authorization'] = 'Bearer $token';

      // Jika user memilih gambar baru
      if (imageFile != null) {
        final fileName = imageFile!.path.split('/').last;
        final mimeType = lookupMimeType(imageFile!.path);

        debugPrint('🖼️ Selected image: $fileName (MIME: $mimeType)');

        // Validasi MIME type agar sesuai backend
        if (mimeType != 'image/jpeg' && mimeType != 'image/png') {
          if (context.mounted) {
            Navigator.pop(context); // Close loading dialog
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text("File harus berupa gambar .jpg/.jpeg atau .png"),
              ),
            );
          }
          setState(() {
            isSubmitting = false;
          });
          return;
        }

        request.files.add(
          await http.MultipartFile.fromPath(
            'file',
            imageFile!.path,
            contentType: MediaType.parse(mimeType!),
          ),
        );
      } else {
        debugPrint('📁 No new image selected. Using existing image.');
      }

      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      if (context.mounted) {
        Navigator.pop(context); // Close loading dialog
      }

      if (response.statusCode == 200) {
        final updatedData = jsonDecode(response.body);

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Berhasil menyimpan perubahan")),
          );
        }

        // Return with updated data and true flag to trigger refresh
        // Use a direct navigation approach to reduce the navigation chain
        if (context.mounted) {
          // Pop back to MenuPage directly with refresh flag
          Navigator.of(context).popUntil(
            (route) => route.settings.name == '/menu' || route.isFirst,
          );

          // Trigger a refresh on the MenuPage
          // This is handled by the navigation listener in MainNavigation
        }
        return;
      }

      debugPrint("RESPONSE STATUS: ${response.statusCode}");
      debugPrint("RESPONSE BODY: ${response.body}");

      if (response.statusCode == 200) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("Berhasil menyimpan perubahan")),
          );

          // Pop back to MenuPage directly with refresh flag
          Navigator.of(context).popUntil(
            (route) => route.settings.name == '/menu' || route.isFirst,
          );
        }
      } else {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text("Gagal menyimpan: ${response.statusCode}")),
          );
        }
      }
    } catch (e) {
      debugPrint("❌ Error saat upload: $e");
      if (context.mounted) {
        Navigator.pop(context); // Close loading dialog
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Terjadi kesalahan saat menyimpan")),
        );
      }
    } finally {
      setState(() {
        isSubmitting = false;
      });
    }
  }

  // Fungsi untuk mengambil gambar menggunakan http
  Future<void> fetchImage(String imageName) async {
    try {
      final token = await JwtUtils.getToken();
      final path =
          imageName.startsWith('/')
              ? imageName
              : '/api/menus/images/$imageName';

      final response = await http.get(
        Uri.parse('http://10.0.2.2:8080$path'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (response.statusCode == 200) {
        final byteData = response.bodyBytes;
        final imageUrl =
            Uri.dataFromBytes(byteData, mimeType: 'image/png').toString();

        setState(() {
          imageToDisplay = imageUrl;
        });
      } else {
        throw Exception('Failed to load image');
      }
    } catch (e) {
      debugPrint('Error fetching image: $e');
      setState(() {
        imageToDisplay = null; // Biarkan null untuk menampilkan Icon error
      });
    }
  }

  @override
  void initState() {
    super.initState();
    nameController = TextEditingController(text: widget.foodData['name'] ?? '');
    priceController = TextEditingController(
      text: widget.foodData['price'].toString(),
    );
    descriptionController = TextEditingController(
      text: widget.foodData['description'] ?? '',
    );
    imageController = TextEditingController(
      text: widget.foodData['image'] ?? '',
    );

    // Set initial category
    selectedCategory = (widget.foodData['category'] ?? '').toLowerCase();

    // Tambahkan pemanggilan fungsi fetchImage di sini
    if (imageController.text.isNotEmpty) {
      fetchImage(imageController.text);
    }
  }

  @override
  void dispose() {
    nameController.dispose();
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
              color: AppColors.red,
            ),

            // White curved container
            Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                height: MediaQuery.of(context).size.height * 0.7,
                decoration: const BoxDecoration(
                  color: AppColors.white,
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
                          Navigator.pop(context, {
                            'refresh': false,
                          }); // Don't trigger refresh if just going back
                        },
                        child: const Icon(
                          Icons.arrow_back,
                          color: AppColors.black,
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
                            onTap:
                                isProcessingImage
                                    ? null
                                    : _showImagePickerOptions,
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
                                child:
                                    isProcessingImage
                                        ? const Center(
                                          child: CircularProgressIndicator(
                                            color: Color(0xFFE15B5B),
                                          ),
                                        )
                                        : ClipOval(
                                          child:
                                              imageFile != null
                                                  ? Image.file(
                                                    imageFile!,
                                                    fit: BoxFit.cover,
                                                    width: 200,
                                                    height: 200,
                                                  )
                                                  : (imageToDisplay != null
                                                      ? Image.memory(
                                                        Uri.parse(
                                                              imageToDisplay!,
                                                            ).data!
                                                            .contentAsBytes(),
                                                        fit: BoxFit.cover,
                                                        width: 200,
                                                        height: 200,
                                                        errorBuilder:
                                                            (
                                                              context,
                                                              error,
                                                              stackTrace,
                                                            ) => const Icon(
                                                              Icons
                                                                  .broken_image,
                                                              size: 100,
                                                            ),
                                                      )
                                                      : const Center(
                                                        child:
                                                            CircularProgressIndicator(),
                                                      )),
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
                                _buildFormField(
                                  'Menu name',
                                  nameController,
                                  'Enter menu name',
                                ),
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
                                          value:
                                              selectedCategory.isEmpty
                                                  ? null
                                                  : selectedCategory,
                                          onChanged: (String? newValue) {
                                            setState(() {
                                              selectedCategory = newValue!;
                                            });
                                          },
                                          items:
                                              <String>[
                                                'Food',
                                                'Drink',
                                                'Dessert',
                                              ].map<DropdownMenuItem<String>>((
                                                String value,
                                              ) {
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
                                _buildFormField(
                                  'Menu price',
                                  priceController,
                                  'Enter a price',
                                  isNumber: true,
                                ),
                                const SizedBox(height: 16),

                                // Menu description
                                _buildFormField(
                                  'Menu description',
                                  descriptionController,
                                  'Write description',
                                ),

                                // Divider
                                const Padding(
                                  padding: EdgeInsets.symmetric(vertical: 10),
                                  child: Divider(
                                    color: Colors.white,
                                    thickness: 1,
                                    height: 1,
                                  ),
                                ),

                                // Action buttons - Keeping the original 3 buttons
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 16.0),
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceEvenly,
                                    children: [
                                      // Delete button
                                      Expanded(
                                        child: ElevatedButton(
                                          onPressed:
                                              isDeleting || isSubmitting
                                                  ? null
                                                  : () {
                                                    _showDeleteConfirmation(
                                                      context,
                                                    );
                                                  },
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: const Color(
                                              0xFFE15B5B,
                                            ),
                                            foregroundColor: Colors.white,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(30),
                                            ),
                                            padding: const EdgeInsets.symmetric(
                                              vertical: 16,
                                            ),
                                          ),
                                          child: Text(
                                            isDeleting
                                                ? 'Deleting...'
                                                : 'Delete Menu',
                                            style: const TextStyle(
                                              fontSize: 15,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ),

                                      const SizedBox(width: 8),

                                      // Discard button
                                      Expanded(
                                        child: OutlinedButton(
                                          onPressed:
                                              isSubmitting || isDeleting
                                                  ? null
                                                  : () {
                                                    Navigator.pop(context);
                                                  },
                                          style: OutlinedButton.styleFrom(
                                            foregroundColor: Colors.black,
                                            backgroundColor: Colors.white,
                                            side: BorderSide(
                                              color: Colors.grey[300]!,
                                            ),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(30),
                                            ),
                                            padding: const EdgeInsets.symmetric(
                                              vertical: 16,
                                            ),
                                          ),
                                          child: const Text(
                                            'Discard Change',
                                            style: TextStyle(
                                              fontSize: 15,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ),

                                      const SizedBox(width: 8),

                                      // Save button
                                      Expanded(
                                        child: ElevatedButton(
                                          onPressed:
                                              isSubmitting ||
                                                      isProcessingImage ||
                                                      isDeleting
                                                  ? null
                                                  : () {
                                                    _saveChanges(context);
                                                  },
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.black,
                                            foregroundColor: Colors.white,
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(30),
                                            ),
                                            padding: const EdgeInsets.symmetric(
                                              vertical: 16,
                                            ),
                                          ),
                                          child: Text(
                                            isSubmitting
                                                ? 'Submitting...'
                                                : 'Save Change',
                                            style: const TextStyle(
                                              fontSize: 15,
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

  Widget _buildFormField(
    String label,
    TextEditingController controller,
    String hintText, {
    bool isNumber = false,
    bool readOnly = false,
  }) {
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
                  keyboardType:
                      isNumber ? TextInputType.number : TextInputType.text,
                  readOnly: readOnly,
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

  void _showDeleteConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Delete Menu'),
            content: const Text(
              'Are you sure you want to delete this menu item?',
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                },
                child: const Text('Cancel'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  _deleteMenu(); // Call the delete function
                },
                child: const Text(
                  'Delete',
                  style: TextStyle(color: Color(0xFFE15B5B)),
                ),
              ),
            ],
          ),
    );
  }
}

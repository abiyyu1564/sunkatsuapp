import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';


class EditMenuPage extends StatefulWidget {
  final Map<String, dynamic> foodData;

  const EditMenuPage({super.key, required this.foodData});

  @override
  State<EditMenuPage> createState() => _EditMenuPageState();
}

class _EditMenuPageState extends State<EditMenuPage> {
  late TextEditingController nameController;
  late TextEditingController categoryController;
  late TextEditingController priceController;
  late TextEditingController descriptionController;
  late TextEditingController imageController;
  String? imageToDisplay;
  File? imageFile;

  // Fungsi pilih gambar
  Future<void> pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);

    if (pickedFile != null) {
      setState(() {
        imageFile = File(pickedFile.path);
      });
    }
  }


  // Fungsi Edit Menu
  Future<void> _saveChanges(BuildContext context) async {
    final token = await JwtUtils.getToken();
    if (token == null) return;

    final id = widget.foodData['id'];

    // Buat URI dengan query parameters
    final uri = Uri.parse('http://localhost:8080/api/menus/$id').replace(queryParameters: {
      'name': nameController.text,
      'price': priceController.text,
      'desc': descriptionController.text,
      'category': categoryController.text,
      'nums_bought': (widget.foodData['nums_bought'] ?? 0).toString(),
    });

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
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text("File harus berupa gambar .jpg/.jpeg atau .png")),
          );
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

      if (response.statusCode == 200) {
        final updatedData = jsonDecode(response.body);

        Navigator.pop(context, {
          'name': nameController.text,
          'price': int.tryParse(priceController.text) ?? 0,
          'category': categoryController.text,
          'description': descriptionController.text,
          'image': updatedData['image'], // <-- ini yang AKURAT
        });
        return;
      }


      debugPrint("RESPONSE STATUS: ${response.statusCode}");
      debugPrint("RESPONSE BODY: ${response.body}");

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Berhasil menyimpan perubahan")),
        );
        Navigator.pop(context, {
          'name': nameController.text,
          'price': int.tryParse(priceController.text) ?? 0,
          'category': categoryController.text,
          'description': descriptionController.text,
          'image': imageFile != null
              ? imageFile!.path.split('/').last // atau pakai nama dari server jika ada
              : widget.foodData['image'],
        });
        // kembali ke halaman sebelumnya
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Gagal menyimpan: ${response.statusCode}")),
        );
      }
    } catch (e) {
      debugPrint("❌ Error saat upload: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Terjadi kesalahan saat menyimpan")),
      );
    }
  }




  // Fungsi untuk menampilkan gambar
  // Fungsi untuk mengambil gambar menggunakan http
  Future<void> fetchImage(String imageName) async {
    try {
      final token = await JwtUtils.getToken();
      final response = await http.get(
        Uri.parse('http://localhost:8080/api/menus/images/$imageName'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final byteData = response.bodyBytes;
        final imageUrl = Uri.dataFromBytes(byteData, mimeType: 'image/png').toString();

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
    categoryController = TextEditingController(text: widget.foodData['category'] ?? '');
    priceController = TextEditingController(text: widget.foodData['price'].toString());
    descriptionController = TextEditingController(text: widget.foodData['description'] ?? '');
    imageController = TextEditingController(text: widget.foodData['image'] ?? '');

    // 🧠 Tambahkan pemanggilan fungsi fetchImage di sini
    if (imageController.text.isNotEmpty) {
      fetchImage(imageController.text);
    }
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
                  child: imageToDisplay != null
                      ? Container(
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
                      child: imageFile != null
                          ? Image.file(
                        imageFile!,
                        fit: BoxFit.cover,
                      )
                          : (imageToDisplay != null
                          ? Image.memory(
                        Uri.parse(imageToDisplay!).data!.contentAsBytes(),
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) =>
                        const Icon(Icons.broken_image, size: 100),
                      )
                          : const Center(child: CircularProgressIndicator())),
                    )
                  )
                      : const Center(child: CircularProgressIndicator()),
                ),

                // Form fields
                Expanded(
                  child: SingleChildScrollView(
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

                        TextButton(
                          onPressed: pickImage,
                          child: const Text(
                            "Change Image",
                            style: TextStyle(
                              color: Color(0xFFE15B5B),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),


                        const SizedBox(height: 24),

                        // Action buttons
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
                                      fontSize: 15,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
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


}

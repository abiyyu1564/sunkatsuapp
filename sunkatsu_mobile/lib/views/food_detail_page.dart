import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:sunkatsu_mobile/utils/jwt_utils.dart';
import 'package:sunkatsu_mobile/views/edit_menu_page.dart';
import 'package:sunkatsu_mobile/views/menu_page.dart';
import 'package:sunkatsu_mobile/views/edit_menu_page.dart';
import 'package:sunkatsu_mobile/utils/constants.dart';
import 'dart:convert';

class FoodDetailPage extends StatefulWidget {
  final Map<String, dynamic> foodData;

  const FoodDetailPage({super.key, required this.foodData});

  @override
  State<FoodDetailPage> createState() => _FoodDetailPageState();
}

class _FoodDetailPageState extends State<FoodDetailPage> {
  int quantity = 1;
  String? imageToDisplay;
  String? userRole;
  bool isLoading = true;
  bool _hasEdited = false;
  late int totalAmount; // Add total amount variable

  @override
  void initState() {
    super.initState();
    final imageName = widget.foodData['image'];
    fetchImage(imageName);
    loadUserRole();

    // Initialize total amount
    totalAmount = widget.foodData['price'] * quantity;
  }

  void incrementQuantity() {
    setState(() {
      quantity++;
      // Update total amount when quantity changes
      totalAmount = widget.foodData['price'] * quantity;
    });
  }

  void decrementQuantity() {
    if (quantity > 1) {
      setState(() {
        quantity--;
        // Update total amount when quantity changes
        totalAmount = widget.foodData['price'] * quantity;
      });
    }
  }

  //ngambil userRole
  Future<void> loadUserRole() async {
    final payload = await JwtUtils.parseJwtPayload();
    setState(() {
      userRole = payload?['role'];
      isLoading = false;
    });
  }


  //Fungsi untuk mengecek cart
  Future<String?> getOrCreateCart() async {
    final token = await JwtUtils.getToken();
    final userId = await JwtUtils.getUserId();
    if (token == null || userId == null) return null;

    try {
      // Coba ambil cart yang sudah ada
      final res = await http.get(
        Uri.parse('http://localhost:8080/api/customers/$userId/cart'),
        headers: {'Authorization': 'Bearer $token'},
      );

      if (res.statusCode == 200) {
        final cart = jsonDecode(res.body);
        // Pastikan ID cart dikembalikan sebagai String
        return cart['id'].toString();  // Ubah menjadi String
      } else {
        // Kalau belum ada, buat cart kosong
        final emptyRes = await http.get(
          Uri.parse('http://localhost:8080/api/carts/empty?UserId=$userId'),
          headers: {'Authorization': 'Bearer $token'},
        );
        if (emptyRes.statusCode == 200) {
          final cart = jsonDecode(emptyRes.body);
          return cart['id'].toString();  // Ubah menjadi String
        }
      }
    } catch (e) {
      debugPrint('Error getting/creating cart: $e');
    }

    return null;
  }


  // fungsi add to cart
  Future<void> addToCart() async {
    // Show loading indicator
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
                Text("Adding to cart..."),
              ],
            ),
          ),
        );
      },
    );

    final token = await JwtUtils.getToken();
    final cartId = await getOrCreateCart();
    final userId = await JwtUtils.getUserId();

    debugPrint("Token: $token");
    debugPrint("UserID: $userId");

    if (token == null || cartId == null) {
      Navigator.pop(context); // Close loading dialog
      return;
    }

    final menuId = widget.foodData['id']; // Pastikan `id` tersedia
    debugPrint(widget.foodData['id'].toString());

    final uri = Uri.parse('http://localhost:8080/api/carts/$cartId/add-menu')
        .replace(queryParameters: {
      'menuId': menuId.toString(),
      'quantity': quantity.toString(),
      'deliver': 'in store',
      'note': 'apalah',
    });

    try {
      final response = await http.post(uri, headers: {
        'Authorization': 'Bearer $token',
      });

      // Close loading dialog
      if (context.mounted) {
        Navigator.pop(context);
      }

      if (response.statusCode == 200) {
        // Tampilkan SnackBar
        debugPrint('berhasil add to cart');
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Berhasil ditambahkan ke keranjang"),
              duration: Duration(seconds: 2),
            ),
          );
        }

        // Delay sebentar sebelum navigasi (agar snackbar terlihat)
        await Future.delayed(const Duration(milliseconds: 300));

        // Navigasi ke MenuPage
        if (context.mounted) {
          // Pop back to MenuPage with refresh flag
          Navigator.of(context).pop(true);
        }
      } else {
        debugPrint('Add to cart failed: ${response.statusCode}');
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("Failed to add to cart: ${response.statusCode}"),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      // Close loading dialog
      if (context.mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Error: $e"),
            backgroundColor: Colors.red,
          ),
        );
      }
      debugPrint('Error adding to cart: $e');
    }
  }



  // Fungsi untuk mengambil gambar menggunakan http
  Future<void> fetchImage(String imageName) async {
    debugPrint("🖼️ Trying to fetch image: $imageName");

    try {
      final token = await JwtUtils.getToken();
      final path = imageName.startsWith('/')
          ? imageName
          : '/api/menus/images/$imageName';

      final response = await http.get(
        Uri.parse('http://localhost:8080$path'),
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

  // Format price with thousand separator
  String formatPrice(int price) {
    return price.toString().replaceAllMapped(
        RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
            (Match m) => '${m[1]}.'
    );
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
                        // Return with hasEdited flag to trigger refresh if needed
                        Navigator.of(context).pop(_hasEdited);
                        debugPrint("Returning with hasEdited: $_hasEdited");
                      },
                      child: const Icon(
                        Icons.arrow_back,
                        color: AppColors.black,
                      ),
                    ),
                  ),
                ),

                // Add spacing to push the image lower
                const SizedBox(height: 50),

                // Food image (memastikan image telah didapatkan)
                Center(
                  child: imageToDisplay != null
                      ? Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.black.withAlpha(64),
                          spreadRadius: 2,
                          blurRadius: 20,
                          offset: const Offset(0, 15),
                        ),
                      ],
                    ),
                    child: ClipOval(
                      child: Image.memory(
                        Uri.parse(imageToDisplay!).data!.contentAsBytes(), // convert dari Data URI
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) =>
                        const Icon(Icons.broken_image, size: 100),
                      ),
                    ),
                  )
                      : Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey[200],
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.black.withAlpha(128),
                          spreadRadius: 2,
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                    ),
                    child: const Center(child: CircularProgressIndicator()),
                  ),
                ),

                // Food details
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Food name and quantity controls
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    widget.foodData['name'], // Nama makanan
                                    style: const TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Food',
                                    style: TextStyle(
                                      color: AppColors.black.withAlpha(128),
                                      fontSize: 16,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Rp ${formatPrice(widget.foodData['price'])}',
                                    style: TextStyle(
                                      color: AppColors.red,
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (userRole == 'CUSTOMER')
                            Row(
                              children: [
                                // Minus button
                                GestureDetector(
                                  onTap: decrementQuantity,
                                  child: Container(
                                    width: 36,
                                    height: 36,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.grey),
                                    ),
                                    child: const Icon(
                                      Icons.remove,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ),

                                // Quantity
                                Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 12.0),
                                  child: Text(
                                    '$quantity',
                                    style: const TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),

                                // Plus button
                                GestureDetector(
                                  onTap: incrementQuantity,
                                  child: Container(
                                    width: 36,
                                    height: 36,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      border: Border.all(color: Colors.grey),
                                    ),
                                    child: const Icon(
                                      Icons.add,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),

                        const SizedBox(height: 24),

                        // Description
                        Text(
                          widget.foodData['description'], // Deskripsi makanan
                          style: TextStyle(
                            color: AppColors.black.withAlpha(128),
                            fontSize: 14,
                            height: 1.5,
                          ),
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

                        // Total and add to cart button
                        userRole == 'OWNER'
                            ? Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'This item is owned by you',
                              style: TextStyle(
                                fontSize: 14,
                                color: AppColors.black.withAlpha(128),
                              ),
                            ),
                            ElevatedButton.icon(
                              onPressed: () async {
                                // Show loading indicator
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
                                            Text("Loading editor..."),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                );

                                // Small delay to show loading
                                await Future.delayed(const Duration(milliseconds: 100));

                                if (context.mounted) {
                                  // Close loading dialog
                                  Navigator.pop(context);

                                  // navigasi ke halaman edit
                                  final updatedFoodData = await Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => EditMenuPage(foodData: widget.foodData),
                                    ),
                                  );

                                  // Jika ada data hasil edit yang dikembalikan
                                  if (updatedFoodData != null && mounted) {
                                    setState(() {
                                      widget.foodData.addAll(updatedFoodData);
                                      fetchImage(updatedFoodData['image']);
                                      _hasEdited = true; // tandai bahwa sudah diedit

                                      // Update total amount if price changed
                                      totalAmount = widget.foodData['price'] * quantity;
                                    });
                                  }
                                }
                              },
                              icon: const Icon(Icons.edit, color: AppColors.white,),
                              label: const Text('Edit Menu'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.red,
                                foregroundColor: AppColors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                            )
                          ],
                        )
                            : Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('Total amount',
                                  style: TextStyle(color: Colors.grey, fontSize: 14),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Rp ${formatPrice(totalAmount)}', // Use calculated total amount
                                  style: const TextStyle(
                                    color: Color(0xFFE15B5B),
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                            ElevatedButton(
                              onPressed: addToCart,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFE15B5B),
                                foregroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                              ),
                              child: const Text(
                                'Add to cart',
                                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ],
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
}

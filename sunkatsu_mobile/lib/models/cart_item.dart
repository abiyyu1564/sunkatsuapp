import 'menu.dart';  // Import Menu model

class CartItem {
  final int id;
  final String note;
  final int quantity;
  final Menu menu;  // Menu terkait dengan item pesanan

  CartItem({
    required this.id,
    required this.note,
    required this.quantity,
    required this.menu,
  });

  factory CartItem.fromJson(Map<String, dynamic> json) {
    return CartItem(
      id: json['id'],
      note: json['note'],
      quantity: json['quantity'],
      menu: Menu.fromJson(json['menu']),  // Parsing Menu terkait
    );
  }
}

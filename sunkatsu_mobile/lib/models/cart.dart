import 'menu.dart';

class CartItemModel {
  final int id;
  final int quantity;
  final String note;
  final Menu menu;

  CartItemModel({
    required this.id,
    required this.quantity,
    required this.note,
    required this.menu,
  });

  factory CartItemModel.fromJson(Map<String, dynamic> json) {
    return CartItemModel(
      id: json['id'],
      quantity: json['quantity'],
      note: json['note'] ?? '',
      menu: Menu.fromJson(json['menu']),
    );
  }
}

class ShoppingCart {
  final int id;
  final int total;
  final List<CartItemModel> cartItems;

  ShoppingCart({
    required this.id,
    required this.total,
    required this.cartItems,
  });

  factory ShoppingCart.fromJson(Map<String, dynamic> json) {
    return ShoppingCart(
      id: json['id'],
      total: json['total'],
      cartItems: (json['cartItems'] as List)
          .map((item) => CartItemModel.fromJson(item))
          .toList(),
    );
  }
}
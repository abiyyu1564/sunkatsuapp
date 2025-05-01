import 'menu_item.dart';

class Favorite {
  final int id;
  final int timesBought;
  final int userId;
  final MenuItem menu;

  Favorite({
    required this.id,
    required this.timesBought,
    required this.userId,
    required this.menu,
  });

  factory Favorite.fromJson(Map<String, dynamic> json) {
    return Favorite(
      id: json['id'] ?? json['ID'] ?? 0,
      timesBought: json['timesBought'] ?? 0,
      userId: json['userID'] ?? 0,
      menu: MenuItem.fromJson(json['menu']),
    );
  }
}

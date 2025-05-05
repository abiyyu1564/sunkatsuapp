class Menu {
  final int id;
  final String name;
  final String imageUrl;
  final int price;
  final String desc;
  final String category;

  Menu({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.price,
    required this.desc,
    required this.category,
  });

  factory Menu.fromJson(Map<String, dynamic> json){
    return Menu(
      id: json['id'],
      name: json['name'] ?? '',
      imageUrl: json['imageURL'] ?? json['image'] ?? '',
      price: json['price'] ?? 0,
      desc: json['desc'] ?? '',
      category: json['category'] ?? '',
    );
  }
}


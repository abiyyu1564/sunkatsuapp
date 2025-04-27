class MenuItem {
  final String name;
  final String imageUrl;
  final int price;
  final String desc;
  final String category;

  MenuItem({
    required this.name,
    required this.imageUrl,
    required this.price,
    required this.desc,
    required this.category,
  });

    factory MenuItem.fromJson(Map<String, dynamic> json){
      return MenuItem(
        name: json['name'] ?? '',
        imageUrl: json['imageURL'] ?? json['image'] ?? '',
        price: json['price'] ?? 0,
        desc: json['desc'] ?? '',
        category: json['category'] ?? '',
      );
    }
  }


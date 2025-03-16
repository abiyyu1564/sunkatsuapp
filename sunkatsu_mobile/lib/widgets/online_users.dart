import 'package:flutter/material.dart';
import '../models/user.dart';

typedef OnUserSelected = void Function(String userId);

class OnlineUsers extends StatelessWidget {
  final List<User> users;
  final OnUserSelected onUserSelected;

  const OnlineUsers({required this.users, required this.onUserSelected, super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      color: Colors.grey.shade200,
      child: Column(
        children: [
          const Padding(
            padding: EdgeInsets.all(8.0),
            child: Text('Online Users', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: users.length,
              itemBuilder: (context, index) {
                final user = users[index];
                return ListTile(
                  title: Text(user.username),
                  leading: Icon(Icons.circle, color: user.isOnline ? Colors.green : Colors.grey),
                  onTap: () => onUserSelected(user.id),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
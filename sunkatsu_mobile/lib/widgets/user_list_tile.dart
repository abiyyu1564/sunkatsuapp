import 'package:flutter/material.dart';

class UserListTile extends StatelessWidget {
  final String userId;
  final String username;
  final String? selectedUserId;
  final VoidCallback onTap;

  const UserListTile({
    super.key,
    required this.userId,
    required this.username,
    required this.onTap,
    this.selectedUserId,
  });

  @override
  Widget build(BuildContext context) {
    final isSelected = userId == selectedUserId;
    return ListTile(
      selected: isSelected,
      tileColor: isSelected ? Colors.white24 : null,
      title: Text(
        username,
        style: const TextStyle(color: Colors.white),
      ),
      onTap: onTap,
    );
  }
}

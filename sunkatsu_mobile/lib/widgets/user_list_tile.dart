import 'package:flutter/material.dart';
import '../utils/constants.dart';

class UserListTile extends StatelessWidget {
  final String userId;
  final String username;
  final String? selectedUserId;
  final VoidCallback onTap;

  const UserListTile({
    required this.userId,
    required this.username,
    required this.selectedUserId,
    required this.onTap,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isSelected = userId == selectedUserId;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.red : Colors.transparent,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: isSelected ? AppColors.white : AppColors.red.withOpacity(0.2),
          child: Text(
            username.isNotEmpty ? username[0].toUpperCase() : '?',
            style: TextStyle(
              color: isSelected ? AppColors.red : AppColors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        title: Text(
          username,
          style: TextStyle(
            color: AppColors.white,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        trailing: Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: Colors.green,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        dense: true,
        onTap: onTap,
        selected: isSelected,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}

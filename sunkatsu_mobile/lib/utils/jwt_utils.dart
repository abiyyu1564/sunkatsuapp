import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class JwtUtils {
  static const _storage = FlutterSecureStorage();
  static const _tokenKey = 'token';

  /// Save JWT token after login
  static Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  /// Retrieve saved token
  static Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  /// Clear token on logout
  static Future<void> clearToken() async {
    await _storage.delete(key: _tokenKey);
  }

  /// Parse JWT and return payload as Map
  static Future<Map<String, dynamic>?> parseJwtPayload() async {
    final token = await getToken();
    if (token == null) return null;

    final parts = token.split('.');
    if (parts.length != 3) return null;

    final payload = utf8.decode(base64Url.decode(base64Url.normalize(parts[1])));
    return jsonDecode(payload);
  }

  /// Get user ID from JWT token
  static Future<String?> getUserId() async {
    final payload = await parseJwtPayload();
    return payload?['id'];
  }
}

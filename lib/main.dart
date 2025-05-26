import 'package:flutter/material.dart';
import '/services/api_service.dart';
import '/screens/login_screen.dart';
import '/screens/home_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiService.init(); // Quan trọng
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('jwt_token');
  runApp(MyApp(token: token));
}

class MyApp extends StatelessWidget {
  final String? token;

  const MyApp({super.key, this.token});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'IoT Management',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: token == null || token!.isEmpty ? const LoginScreen() : const HomeScreen(),
    );
  }
}
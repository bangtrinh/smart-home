import 'package:flutter/material.dart';
import 'package:frontendv2/services/api_service.dart';

class HomeownerScreen extends StatefulWidget {
  const HomeownerScreen({super.key});

  @override
  _HomeownerScreenState createState() => _HomeownerScreenState();
}

class _HomeownerScreenState extends State<HomeownerScreen> {
  final ApiService _apiService = ApiService();
  late List<Map<String, dynamic>> _homeowners = [];

  @override
  void initState() {
    super.initState();
    _fetchHomeowners();
  }

  Future<void> _fetchHomeowners() async {
    try {
      final homeowners = await _apiService.getHomeOwners();
      setState(() {
        _homeowners = homeowners;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load homeowners: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(8.0),
      itemCount: _homeowners.length,
      itemBuilder: (context, index) {
        final homeowner = _homeowners[index];
        return ListTile(
          title: Text(homeowner['fullName']),
          subtitle: Text(homeowner['email']),
          trailing: Text(homeowner['phone']),
        );
      },
    );
  }
}
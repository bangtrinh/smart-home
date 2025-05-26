import 'package:flutter/material.dart';
import 'user_form_screen.dart';
import '/services/api_service.dart';
import '../login_screen.dart';

class UserListScreen extends StatefulWidget {
  const UserListScreen({super.key});

  @override
  _UserListScreenState createState() => _UserListScreenState();
}

class _UserListScreenState extends State<UserListScreen> {
  final ApiService _apiService = ApiService();
  late List<Map<String, dynamic>> _users = [];

  @override
  void initState() {
    super.initState();
    _fetchUsers();
  }

  Future<void> _fetchUsers() async {
    try {
      final users = await _apiService.getUsers();
      setState(() {
        _users = users;
      });
    } catch (e) {
      print('Error fetching users: $e');
      if (e.toString().contains('Token expired or invalid')) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load users: $e')),
      );
    }
  }

  void _navigateToAdd() async {
    bool? result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const UserFormScreen()),
    );
    if (result == true) {
      _fetchUsers();
    }
  }

  void _navigateToEdit(Map<String, dynamic> user) async {
    bool? result = await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => UserFormScreen(user: user)),
    );
    if (result == true) {
      _fetchUsers();
    }
  }

  Future<void> _deleteUser(int id) async {
    try {
      await _apiService.deleteUser(id);
      _fetchUsers();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete user: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('User Management')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: _navigateToAdd,
            child: const Text('Add New User'),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(8.0),
              itemCount: _users.length,
              itemBuilder: (context, index) {
                final user = _users[index];
                return ListTile(
                  title: Text(user['username']),
                  subtitle: Text('Email: ${user['email']} | Roles: ${user['roles'].join(', ')}'),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () => _navigateToEdit(user),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () => _deleteUser(user['id']),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

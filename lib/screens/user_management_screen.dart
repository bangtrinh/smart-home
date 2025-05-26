import 'package:flutter/material.dart';
import 'login_screen.dart';
import '/services/api_service.dart';

class UserManagementScreen extends StatefulWidget {
  const UserManagementScreen({super.key});

  @override
  _UserManagementScreenState createState() => _UserManagementScreenState();
}

class _UserManagementScreenState extends State<UserManagementScreen> {
  final ApiService _apiService = ApiService();
  late List<Map<String, dynamic>> _users = [];
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _rolesController = TextEditingController();
  bool _isEditing = false;
  int? _editingId;

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

  Future<void> _saveUser() async {
    if (_formKey.currentState!.validate()) {
      try {
        final user = {
          'username': _usernameController.text,
          'email': _emailController.text,
          'roles': _rolesController.text.split(',').map((e) => e.trim()).toList(),
        };
        if (_isEditing && _editingId != null) {
          await _apiService.updateUser(_editingId!, user);
        } else {
          await _apiService.addUser(user);
        }
        _fetchUsers();
        _clearForm();
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to save user: $e')),
        );
      }
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

  void _editUser(Map<String, dynamic> user) {
    setState(() {
      _isEditing = true;
      _editingId = user['id'];
      _usernameController.text = user['username'];
      _emailController.text = user['email'];
      _rolesController.text = user['roles'].join(',');
    });
  }

  void _clearForm() {
    setState(() {
      _isEditing = false;
      _editingId = null;
      _usernameController.clear();
      _emailController.clear();
      _rolesController.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('User Management')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _usernameController,
                    decoration: const InputDecoration(labelText: 'Username'),
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Enter username';
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(labelText: 'Email'),
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Enter email';
                      return null;
                    },
                  ),
                  TextFormField(
                    controller: _rolesController,
                    decoration: const InputDecoration(labelText: 'Roles (comma-separated, e.g., ADMIN,USER)'),
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Enter roles';
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _saveUser,
                    child: Text(_isEditing ? 'Update User' : 'Add User'),
                  ),
                  ElevatedButton(
                    onPressed: _clearForm,
                    child: const Text('Clear'),
                  ),
                ],
              ),
            ),
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
                        onPressed: () => _editUser(user),
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
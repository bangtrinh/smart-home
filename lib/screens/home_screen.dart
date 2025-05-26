import 'package:flutter/material.dart';
import '/screens/user/user_list_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import 'assign_contract_screen.dart';
import 'contract/contract_list_screen.dart';
import 'device/device_list.dart';
import 'device_control_screen.dart';
import 'homeowner/home_owner_list.dart';
import 'mqtt_control_screen.dart';
import 'user_management_screen.dart';
import 'homeowner_screen.dart';
import 'device_control_history_screen.dart';
import '/services/api_service.dart';
import 'login_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _apiService = ApiService();
  int _selectedIndex = 0;
  late List<Widget> _widgetOptions;
  late User? _currentUser;

  @override
  void initState() {
    super.initState();
    _currentUser = null;
    _loadUser();
    _widgetOptions = <Widget>[
      const HomeOwnerList(),
      const DeviceList(),
      const DeviceControlHistoryScreen(),
      const AssignContractScreen(),
      const MqttControlScreen(),
      const ContractListScreen(), // Thêm tab Contract
      const UserListScreen(),
    ];
  }

  Future<void> _loadUser() async {
    try {
      final token = await SharedPreferences.getInstance().then((prefs) => prefs.getString('jwt_token'));
      if (token != null) {
        final user = await _apiService.getCurrentUser();
        setState(() {
          _currentUser = user;
        });
      } else {
        // Nếu không có token, chuyển về LoginScreen
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
    } catch (e) {
      print('Error loading user: $e');
      if (e.toString().contains('Token expired or invalid')) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const LoginScreen()),
        );
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load user: $e')),
      );
    }
  }

  void _onItemTapped(int index) {
    if (_currentUser?.roles.contains('ADMIN') ?? false) {
      setState(() {
        _selectedIndex = index;
      });
    } else if (index > 4) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Only admins can access management screens')),
      );
    } else {
      setState(() {
        _selectedIndex = index;
      });
    }
  }

  void _logout() async {
    try {
      await _apiService.logout();
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Logout failed: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('IoT Management')),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Colors.blue),
              child: Text('Menu'),
            ),
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text('Home Owners'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(0);
              },
            ),
            ListTile(
              leading: const Icon(Icons.history),
              title: const Text('Device Management'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(1);
              },
            ),
            ListTile(
              leading: const Icon(Icons.history),
              title: const Text('Device History'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(2);
              },
            ),
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text('Contract'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(3);
              },
            ),
            ListTile(
              leading: const Icon(Icons.devices),
              title: const Text('Control'),
              onTap: () {
                Navigator.pop(context);
                _onItemTapped(4);
              },
            ),
            if (_currentUser?.roles.contains('ADMIN') ?? false) ...[
              ListTile(
                leading: const Icon(Icons.description),
                title: const Text('Contract Management'),
                onTap: () {
                  Navigator.pop(context);
                  _onItemTapped(5);
                },
              ),
              ListTile(
                leading: const Icon(Icons.people),
                title: const Text('User Management'),
                onTap: () {
                  Navigator.pop(context);
                  _onItemTapped(6);
                },
              ),
            ],
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text('Logout'),
              onTap: _logout,
            ),
          ],
        ),
      ),
      body: _widgetOptions.elementAt(_selectedIndex),
    );
  }
}
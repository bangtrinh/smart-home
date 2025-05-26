import 'package:flutter/material.dart';
import 'package:frontendv2/screens/homeowner/home_owner_form.dart';
import '/services/api_service.dart';

class HomeOwnerList extends StatefulWidget {
  const HomeOwnerList({super.key});

  @override
  _HomeOwnerListState createState() => _HomeOwnerListState();
}

class _HomeOwnerListState extends State<HomeOwnerList> {
  final ApiService _apiService = ApiService();
  List<Map<String, dynamic>> _homeOwners = [];
  String? _errorMessage;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _fetchHomeOwners();
  }

  Future<void> _fetchHomeOwners() async {
    if (_isLoading) return;
    setState(() => _isLoading = true);
    try {
      final homeOwners = await _apiService.getHomeOwners();
      setState(() {
        _homeOwners = homeOwners;
        _errorMessage = null;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Error fetching homeowners: $e';
      });
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _navigateToEdit(Map<String, dynamic> homeOwner) async {
    await Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => HomeOwnerForm(homeOwner: homeOwner)),
    );
    _fetchHomeOwners();
  }

  Future<void> _deleteHomeOwner(int id) async {
    try {
      await _apiService.deleteHomeOwner(id);
      _fetchHomeOwners();
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('HomeOwner deleted successfully')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Home Owners')),
      body: Column(
        children: [
          if (_errorMessage != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
                _errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            ),
          Expanded(
            child: _homeOwners.isEmpty
                ? const Center(child: Text('No HomeOwners available'))
                : ListView.builder(
              itemCount: _homeOwners.length,
              itemBuilder: (context, index) {
                final homeOwner = _homeOwners[index];
                return ListTile(
                  title: Text(homeOwner['fullName'] ?? 'Unnamed'),
                  subtitle: Text(
                    'Email: ${homeOwner['email'] ?? 'N/A'} | Phone: ${homeOwner['phone'] ?? 'N/A'}',
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () => _navigateToEdit(homeOwner),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () => _deleteHomeOwner(homeOwner['ownerId']),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const HomeOwnerForm()),
          );
          _fetchHomeOwners();
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

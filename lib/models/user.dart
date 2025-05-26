class User {
  final int id;
  final String username;
  final String email;
  final List<String> roles;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.roles,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
      roles: List<String>.from(json['roles']),
    );
  }
}

class LoginResponse {
  final String? token;
  final User? user;

  LoginResponse({this.token, this.user});

  factory LoginResponse.fromJson(Map<String, dynamic> json) {
    return LoginResponse(
      token: json['token'],
      user: json['user'] != null ? User.fromJson(json['user']) : null,
    );
  }
}
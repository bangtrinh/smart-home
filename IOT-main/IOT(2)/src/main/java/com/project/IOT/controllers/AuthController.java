package com.project.IOT.controllers;

import com.project.IOT.dtos.LoginRequest;
import com.project.IOT.dtos.ResetPasswordRequest;
import com.project.IOT.dtos.UserDTO;
import com.project.IOT.entities.User;
import com.project.IOT.responsitories.UserRepository;
import com.project.IOT.Config.JwtUtil;
import com.project.IOT.Exception.ResourceNotFoundException;
import com.project.IOT.services.UserService; // Đảm bảo import

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          JwtUtil jwtUtil,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for email: " + loginRequest.getEmail());
        System.out.println("Password: " + loginRequest.getPassword());
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("Authentication successful for email: " + loginRequest.getEmail());

            String token = jwtUtil.generateToken(loginRequest.getEmail());
            User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            UserDTO userDTO = convertToDTO(user);
            return ResponseEntity.ok(Map.of(
                "user", userDTO,
                "token", token
            ));
        } catch (Exception e) {
            System.out.println("Authentication failed: " + e.getMessage());
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserDTO userDTO) {
        System.out.println("Register attempt for email: " + userDTO.getEmail());
        System.out.println("Register data: " + userDTO.toString());
        try {
            Map<String, Object> response = userService.register(userDTO);
            System.out.println("Register successful for email: " + userDTO.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Register failed: " + e.getMessage());
            throw e;
        }
    }
   @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            System.out.println("Forgot password request for email: " + email);
            
            userService.sendResetPasswordEmail(email);
            
            // Trả về response thống nhất với các API khác
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "If this email exists, a reset link has been sent"
            ));
        } catch (ResourceNotFoundException e) {
            // Vẫn trả về success nhưng không tiết lộ email có tồn tại hay không
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "If this email exists, a reset link has been sent"
            ));
        } catch (Exception e) {
            System.out.println("Forgot password error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", "Error processing your request"
                ));
        }
    }

    @PostMapping("/confirm-token")
    public ResponseEntity<String> showResetPage(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        System.out.println("Token received: " + token);

        if (token == null || token.isEmpty()) {
            return ResponseEntity.badRequest().body("Token is required");
        }

        // Kiểm tra token hợp lệ
        if (!userService.isValidToken(token)) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        return ResponseEntity.ok("Token valid - Proceed to Flutter reset screen");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest resetRequest) {
        try {
            System.out.println("Reset password request with token: " + resetRequest.getToken());
            
            userService.resetPassword(resetRequest.getToken(), resetRequest.getNewPassword());
            
            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Password has been reset successfully"
            ));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                    "status", "error",
                    "message", "Invalid or expired reset token"
                ));
        } catch (Exception e) {
            System.out.println("Reset password error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                    "status", "error",
                    "message", "Error resetting password"
                ));
        }
    }
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream()
            .map(role -> role.getName())
            .collect(Collectors.toSet()));
        return dto;
    }
}
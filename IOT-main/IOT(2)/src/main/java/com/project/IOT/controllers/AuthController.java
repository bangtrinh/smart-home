package com.project.IOT.controllers;

import com.project.IOT.Config.JwtUtil;
import com.project.IOT.DTOS.LoginRequest;
import com.project.IOT.DTOS.LoginResponseDTO;
import com.project.IOT.DTOS.ResetPasswordConfirmDTO;
import com.project.IOT.DTOS.ResetPasswordRequest;
import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.UserAccountMapper;
import com.project.IOT.services.UserAccountService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserAccountService userAccountService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        UserAccount user = userAccountService.findByUsername(request.getUsername());
        if (user != null && passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            String token = jwtUtil.generateToken(user.getUsername());
            UserAccountDTO userDTO = UserAccountMapper.toDto(user);
            return ResponseEntity.ok(new LoginResponseDTO(token, userDTO));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("Logged out token: " + token);
            return ResponseEntity.ok("Logged out successfully");
        } else {
            return ResponseEntity.badRequest().body("No token provided");
        }
    }


    @PostMapping("/reset-password/request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody ResetPasswordRequest request) {
        userAccountService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok("Reset token sent if email exists");
    }

    @PostMapping("/reset-password/confirm")
    public ResponseEntity<?> confirmPasswordReset(@RequestBody ResetPasswordConfirmDTO request) {
        if (request.getToken() == null || request.getNewPassword() == null || 
            request.getToken().isEmpty() || request.getNewPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Token and new password are required");
        }
        if (userAccountService.validateResetToken(request.getToken())) {
            userAccountService.updatePassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        }
        return ResponseEntity.badRequest().body("Invalid or expired token");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user found");
        }
        UserAccount user = userAccountService.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(UserAccountMapper.toDto(user));
    }
}

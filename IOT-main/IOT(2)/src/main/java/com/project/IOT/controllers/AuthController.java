package com.project.IOT.controllers;

import com.project.IOT.DTOS.LoginRequest;
import com.project.IOT.DTOS.LoginResponseDTO;
import com.project.IOT.DTOS.ResetPasswordConfirmDTO;
import com.project.IOT.DTOS.ResetPasswordRequest;
import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.UserAccountMapper;
import com.project.IOT.services.UserAccountService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserAccountService userAccountService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication); // Ghi nhận authenticated user
            httpRequest.getSession(true); // Kích hoạt session

            HttpSession session = httpRequest.getSession(true);
            session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
            );
            // Trả về thông tin người dùng
            UserAccount userAccount = userAccountService.findByUsername(request.getUsername());
            UserAccountDTO userDTO = UserAccountMapper.toDto(userAccount);
            return ResponseEntity.ok(new LoginResponseDTO(null, userDTO));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, 
                                    @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user found");
        }
        SecurityContextHolder.clearContext();
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok("Logged out successfully");
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

    @GetMapping("/session-invalid")
    public ResponseEntity<String> sessionInvalid() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session is invalid, please login again.");
    }

    @GetMapping("/session-expired")
    public ResponseEntity<String> sessionExpired() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired, please login again.");
    }
}

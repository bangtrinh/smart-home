package com.project.IOT.services.Impl;

import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.Entities.PasswordResetToken;
import com.project.IOT.Entities.Role;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.UserAccountMapper;
import com.project.IOT.Repositories.PasswordResetTokenRepository;
import com.project.IOT.Repositories.RoleRepository;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.UserAccountService;
import com.project.IOT.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserAccountServiceImpl implements UserAccountService {
    @Autowired
    private UserAccountRepository userAccountRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;

    @Override
    public UserAccount findByUsername(String username) {
        return userAccountRepository.findByUsername(username).orElse(null);
    }

    @Override
    public UserAccount findByEmail(String email) {
        return userAccountRepository.findByEmail(email).orElse(null);
    }

    @Override
    @Transactional
    public UserAccountDTO createUserAccount(UserAccountDTO dto) {
        if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        UserAccount user = UserAccountMapper.toEntity(dto);
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));  

        if (dto.getRoles() == null) {
            Role defaultRole = roleRepository.findByName("GUEST")
                .orElseThrow(() -> new RuntimeException("Default role not found"));
            user.setRoles(Set.of(defaultRole));
        }
        
        user = userAccountRepository.save(user);
        return UserAccountMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserAccountDTO updateUserAccount(Long userId, UserAccountDTO dto) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }
        if (dto.getRoles() != null) {
            Set<Role> roles = dto.getRoles().stream()
                    .map(roleRepository::findByName)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toSet());            
            user.setRoles(roles);
        }
        user = userAccountRepository.save(user);
        return UserAccountMapper.toDto(user);
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        UserAccount user = findByEmail(email);
        if (user != null) {
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setUser(user);
            resetToken.setToken(token);
            resetToken.setCreatedAt(LocalDateTime.now());
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(10));
            resetToken.setUsed(false);
            tokenRepository.save(resetToken);
            emailService.sendEmail(user.getEmail(), "Password Reset Token: ", token);
        }
    }

    @Override
    public boolean validateResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);
        return resetToken != null && !resetToken.isUsed() 
               && resetToken.getExpiresAt().isAfter(LocalDateTime.now());
    }

    @Override
    @Transactional
    public void updatePassword(String token, String newPassword) {
        if (newPassword == null || newPassword.isEmpty()) {
            throw new IllegalArgumentException("New password is required");
        }
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
        UserAccount user = userAccountRepository.findById(resetToken.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        resetToken.setUsed(true);
        userAccountRepository.save(user);
        tokenRepository.save(resetToken);
    }

    @Override
    public boolean hasRole(UserAccount user, String roleName) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equalsIgnoreCase(roleName));
    }

    @Override
    @Transactional
    public UserAccountDTO assignRole(Long userId, Long roleId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.getRoles().add(role);
        user = userAccountRepository.save(user);
        return UserAccountMapper.toDto(user);
    }

    @Override
    public UserAccountDTO getUserById(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserAccountMapper.toDto(user);
    }

    @Override
    public List<UserAccountDTO> getAllUsers() {
        return userAccountRepository.findAll().stream()
                .map(UserAccountMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUserAccount(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userAccountRepository.delete(user);
    }
}

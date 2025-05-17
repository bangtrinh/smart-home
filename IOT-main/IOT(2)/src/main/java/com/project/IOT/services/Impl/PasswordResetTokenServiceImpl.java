package com.project.IOT.services.Impl;

import com.project.IOT.DTOS.PasswordResetTokenDTO;
import com.project.IOT.Entities.PasswordResetToken;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.PasswordResetTokenMapper;
import com.project.IOT.Repositories.PasswordResetTokenRepository;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.EmailService;
import com.project.IOT.services.PasswordResetTokenService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetTokenServiceImpl implements PasswordResetTokenService {
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;
    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public PasswordResetTokenDTO createResetToken(Long userId) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setToken(token);
        resetToken.setCreatedAt(LocalDateTime.now());
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        resetToken.setUsed(false);
        resetToken = tokenRepository.save(resetToken);
        emailService.sendEmail(user.getEmail(), "Your password reset token is: ", token);
        return PasswordResetTokenMapper.toDto(resetToken);
    }

    @Override
    public boolean validateResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);
        return resetToken != null && !resetToken.isUsed() 
               && resetToken.getExpiresAt().isAfter(LocalDateTime.now());
    }
}

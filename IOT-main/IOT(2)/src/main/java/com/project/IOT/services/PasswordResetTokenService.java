package com.project.IOT.services;

import com.project.IOT.DTOS.PasswordResetTokenDTO;

public interface PasswordResetTokenService {
    PasswordResetTokenDTO createResetToken(Long userId);
    boolean validateResetToken(String token);
}
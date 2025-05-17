package com.project.IOT.services;

import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.Entities.UserAccount;

public interface UserAccountService {
    UserAccount findByUsername(String username);
    UserAccount findByEmail(String email);
    UserAccountDTO createUserAccount(UserAccountDTO dto);
    void requestPasswordReset(String email);
    boolean validateResetToken(String token);
    void updatePassword(String token, String newPassword);
    boolean hasRole(UserAccount user, String roleName);
    UserAccountDTO assignRole(Long userId, Long roleId);
    UserAccountDTO updateUserAccount(Long userId, UserAccountDTO dto);
}
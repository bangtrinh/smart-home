package com.project.IOT.services;

import java.util.List;

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
    List<UserAccountDTO> getAllUsers();
    UserAccountDTO getUserById(Long userId);
    void deleteUserAccount(Long userId);
    void changePassword(Long userId, String oldPassword, String newPassword);
}
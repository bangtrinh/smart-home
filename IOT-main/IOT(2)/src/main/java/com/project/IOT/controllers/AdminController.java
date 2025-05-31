package com.project.IOT.controllers;

import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.services.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserAccountService userAccountService;

    @Autowired
    public AdminController(UserAccountService userAccountService) {
        this.userAccountService = userAccountService;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserAccountDTO>> getAllUsers() {
        List<UserAccountDTO> users = userAccountService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserAccountDTO> getUserById(@PathVariable Long id) {
        UserAccountDTO user = userAccountService.getUserById(id);
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserAccountDTO> createUser(@RequestBody UserAccountDTO user) {
        UserAccountDTO savedUser = userAccountService.createUserAccount(user);
        return ResponseEntity.status(201).body(savedUser);
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','OWNER', 'MEMBER')")
    public ResponseEntity<UserAccountDTO> updateUser(@PathVariable Long id, @RequestBody UserAccountDTO user) {
        UserAccountDTO existingUser = userAccountService.getUserById(id);
        if (existingUser == null) {
            return ResponseEntity.status(404).body(null);
        }
        user.setId(id);
        UserAccountDTO updatedUser = userAccountService.updateUserAccount(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        UserAccountDTO  user = userAccountService.getUserById(id);
        if (user == null) {
            return ResponseEntity.status(404).build();
        }
        userAccountService.deleteUserAccount(id);
        return ResponseEntity.noContent().build();
    }
}
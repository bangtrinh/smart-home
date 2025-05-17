package com.project.IOT.Mapper;

import java.util.HashSet;
import java.util.stream.Collectors;

import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.DTOS.UserDTO;
import com.project.IOT.Entities.Role;
import com.project.IOT.Entities.UserAccount;

public class UserAccountMapper {

    public static UserAccountDTO toDto(UserAccount entity) {
    if (entity == null) return null;

    return UserAccountDTO.builder()
        .id(entity.getId())
        .username(entity.getUsername())
        .email(entity.getEmail())
        .roles(entity.getRoles() != null
            ? entity.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet())
            : new HashSet<>())
        .build();
    }


    public static UserAccount toEntity(UserAccountDTO dto) {
        UserAccount entity = new UserAccount();
        entity.setId(dto.getId());
        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        return entity;
    }
}


package com.project.IOT.Mapper;

import com.project.IOT.DTOS.RoleDTO;
import com.project.IOT.Entities.Role;

public class RoleMapper {

    public static RoleDTO toDto(Role role) {
        if (role == null) return null;

        return RoleDTO.builder()
                .roleId(role.getId())
                .name(role.getName())
                .build();
    }

    public static Role toEntity(RoleDTO dto) {
        if (dto == null) return null;

        return Role.builder()
                .id(dto.getRoleId())
                .name(dto.getName())
                .build();
    }
}

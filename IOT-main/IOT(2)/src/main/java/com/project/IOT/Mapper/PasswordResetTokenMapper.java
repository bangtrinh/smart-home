package com.project.IOT.Mapper;

import com.project.IOT.DTOS.PasswordResetTokenDTO;
import com.project.IOT.Entities.PasswordResetToken;
import com.project.IOT.Entities.UserAccount;

public class PasswordResetTokenMapper {

    public static PasswordResetTokenDTO toDto(PasswordResetToken entity) {
        return new PasswordResetTokenDTO(
                entity.getId(),
                entity.getUser().getId(),
                entity.getToken(),
                entity.getCreatedAt(),
                entity.getExpiresAt(),
                entity.isUsed()
        );
    }

    public static PasswordResetToken toEntity(PasswordResetTokenDTO dto, UserAccount user) {
        return PasswordResetToken.builder()
                .id(dto.getTokenId())
                .user(user)
                .token(dto.getToken())
                .createdAt(dto.getCreatedAt())
                .expiresAt(dto.getExpiresAt())
                .used(dto.getUsed())
                .build();
    }
}


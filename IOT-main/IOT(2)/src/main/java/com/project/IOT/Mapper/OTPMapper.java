package com.project.IOT.Mapper;

import com.project.IOT.DTOS.OTPDTO;
import com.project.IOT.Entities.HomeOwner;
import com.project.IOT.Entities.OTP;

public class OTPMapper {

    public static OTPDTO toDto(OTP entity) {
        return new OTPDTO(
                entity.getId(),
                entity.getOwner().getId(),
                entity.getOtpCode(),
                entity.getCreatedAt(),
                entity.getExpiresAt(),
                entity.isUsed()
        );
    }

    public static OTP toEntity(OTPDTO dto, HomeOwner owner) {
        return OTP.builder()
                .id(dto.getOtpId())
                .owner(owner)
                .otpCode(dto.getOtpCode())
                .createdAt(dto.getCreatedAt())
                .expiresAt(dto.getExpiresAt())
                .used(dto.getUsed())
                .build();
    }
}

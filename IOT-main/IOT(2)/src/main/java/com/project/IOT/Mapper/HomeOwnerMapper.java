package com.project.IOT.Mapper;

import com.project.IOT.DTOS.HomeOwnerDTO;
import com.project.IOT.Entities.HomeOwner;

public class HomeOwnerMapper {

    public static HomeOwnerDTO toDto(HomeOwner entity) {
        return new HomeOwnerDTO(
                entity.getId(),
                entity.getFullName(),
                entity.getEmail(),
                entity.getPhone(),
                entity.getAddress()
        );
    }

    public static HomeOwner toEntity(HomeOwnerDTO dto) {
        HomeOwner entity = new HomeOwner();
        entity.setId(dto.getOwnerId());
        entity.setFullName(dto.getFullName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setAddress(dto.getAddress());
        return entity;
    }
}


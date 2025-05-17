package com.project.IOT.Mapper;

import com.project.IOT.DTOS.DeviceControlDTO;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.DeviceControl;
import com.project.IOT.Entities.UserAccount;

public class DeviceControlMapper {

    public static DeviceControlDTO toDto(DeviceControl entity) {
        return new DeviceControlDTO(
                entity.getId(),
                entity.getUser().getId(),
                entity.getDevice().getId(),
                entity.getStartDate(),
                entity.getEndDate(),
                entity.getStatus()
        );
    }

    public static DeviceControl toEntity(DeviceControlDTO dto, UserAccount user, Device device) {
        return DeviceControl.builder()
                .id(dto.getControlId())
                .user(user)
                .device(device)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus())
                .build();
    }
}


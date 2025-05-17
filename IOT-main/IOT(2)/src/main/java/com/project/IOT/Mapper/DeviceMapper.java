package com.project.IOT.Mapper;

import com.project.IOT.DTOS.DeviceDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;

public class DeviceMapper {

    public static DeviceDTO toDto(Device entity) {
        return new DeviceDTO(
                entity.getId(),
                entity.getContract().getId(),
                entity.getDeviceName(),
                entity.getStatus()
        );
    }

    public static Device toEntity(DeviceDTO dto, Contract contract) {
        return Device.builder()
                .id(dto.getId())
                .contract(contract)
                .deviceName(dto.getDeviceName())
                .status(dto.getStatus())
                .build();
    }
}


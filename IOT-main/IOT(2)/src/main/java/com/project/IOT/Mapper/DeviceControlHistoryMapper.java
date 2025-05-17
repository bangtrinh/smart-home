package com.project.IOT.Mapper;

import com.project.IOT.DTOS.DeviceControlHistoryDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.DeviceControlHistory;
import com.project.IOT.Entities.UserAccount;

public class DeviceControlHistoryMapper {

    public static DeviceControlHistoryDTO toDto(DeviceControlHistory entity) {
        return new DeviceControlHistoryDTO(
                entity.getId(),
                entity.getUser().getId(),
                entity.getDevice().getId(),
                entity.getContract().getId(),
                entity.getAction(),
                entity.getActionTimestamp()
        );
    }

    public static DeviceControlHistory toEntity(DeviceControlHistoryDTO dto, 
                                                UserAccount user,
                                                Device device,
                                                Contract contract) {
        return DeviceControlHistory.builder()
                .id(dto.getHistoryId())
                .user(user)
                .device(device)
                .contract(contract)
                .action(dto.getAction())
                .actionTimestamp(dto.getActionTimestamp())
                .build();
    }
}


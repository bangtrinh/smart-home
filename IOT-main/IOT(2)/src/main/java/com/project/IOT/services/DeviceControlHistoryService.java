package com.project.IOT.services;

import java.util.List;

import com.project.IOT.DTOS.DeviceControlHistoryDTO;

public interface DeviceControlHistoryService {
    DeviceControlHistoryDTO saveHistory(String username, Long deviceId, String action, Long contractId);
    List<DeviceControlHistoryDTO> getHistoryByHomeOwner(String username);
    List<DeviceControlHistoryDTO> getAllControlHistory();
    DeviceControlHistoryDTO getControlHistoryById(Long deviceId);
}
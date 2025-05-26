package com.project.IOT.services;

import java.util.List;

import com.project.IOT.DTOS.DeviceDTO;

public interface DeviceService {
    DeviceDTO findById(Long deviceId);
    List<DeviceDTO> getAllDevices();
    List<DeviceDTO> getDevicesByUser(Long userId);
    DeviceDTO createDevice(DeviceDTO dto);
    DeviceDTO updateDevice(Long deviceId, DeviceDTO dto);
    void deleteDevice(Long deviceId);
    List<DeviceDTO> getDevicesByUserAndContract(Long userId, Long contractId);
}
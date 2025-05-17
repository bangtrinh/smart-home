package com.project.IOT.services;

import com.project.IOT.DTOS.DeviceDTO;
import com.project.IOT.Entities.Device;

public interface DeviceService {
    Device findById(Long deviceId);
    DeviceDTO createDevice(DeviceDTO dto);
    DeviceDTO updateDevice(Long deviceId, DeviceDTO dto);
    void deleteDevice(Long deviceId);
}
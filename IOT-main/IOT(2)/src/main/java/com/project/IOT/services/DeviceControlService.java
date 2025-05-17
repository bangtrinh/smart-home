package com.project.IOT.services;

import com.project.IOT.DTOS.DeviceControlDTO;

public interface DeviceControlService {
    DeviceControlDTO assignControl(DeviceControlDTO dto);
    boolean isControlActive(Long userId, Long deviceId);
}
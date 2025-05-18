package com.project.IOT.services;

import com.project.IOT.DTOS.DeviceControlDTO;
import com.project.IOT.DTOS.assignControlRequestDTO;

public interface DeviceControlService {
    void assignControlRequest(assignControlRequestDTO email);
    DeviceControlDTO assignControl(DeviceControlDTO dto);
    boolean isControlActive(Long userId, Long deviceId);
}
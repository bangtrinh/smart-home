package com.project.IOT.services.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.IOT.DTOS.DeviceControlDTO;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.DeviceControl;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.DeviceControlMapper;
import com.project.IOT.Repositories.DeviceControlRepository;
import com.project.IOT.Repositories.DeviceRepository;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.DeviceControlService;

import java.time.LocalDateTime;

@Service
public class DeviceControlServiceImpl implements DeviceControlService {
    @Autowired
    private DeviceControlRepository deviceControlRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;
    @Autowired
    private DeviceRepository deviceRepository;
    
    @Override
    @Transactional
    public DeviceControlDTO assignControl(DeviceControlDTO dto) {
        UserAccount user = userAccountRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Device device = deviceRepository.findById(dto.getDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found"));
        DeviceControl control = DeviceControlMapper.toEntity(dto, user, device);
        control.setUser(user);
        control = deviceControlRepository.save(control);
        return DeviceControlMapper.toDto(control);
    }

    @Override
    public boolean isControlActive(Long userId, Long deviceId) {
        return deviceControlRepository.findByUserIdAndDeviceIdAndStatus(userId, deviceId, "active")
                .stream().anyMatch(control -> control.getEndDate().isAfter(LocalDateTime.now()));
    }
}
package com.project.IOT.services.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.IOT.DTOS.DeviceControlDTO;
import com.project.IOT.DTOS.OTPDTO;
import com.project.IOT.DTOS.assignControlRequestDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.DeviceControl;
import com.project.IOT.Entities.HomeOwner;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Mapper.DeviceControlMapper;
import com.project.IOT.Repositories.ContractRepository;
import com.project.IOT.Repositories.DeviceControlRepository;
import com.project.IOT.Repositories.DeviceRepository;
import com.project.IOT.Repositories.HomeOwnerRepository;
import com.project.IOT.Repositories.UserAccountRepository;
import com.project.IOT.services.DeviceControlService;
import com.project.IOT.services.EmailService;
import com.project.IOT.services.OtpService;

import java.time.LocalDateTime;

@Service
public class DeviceControlServiceImpl implements DeviceControlService {
    @Autowired
    private DeviceControlRepository deviceControlRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;
    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private ContractRepository contractRepository;
    @Autowired
    private OtpService otpService;
    @Autowired
    private HomeOwnerRepository homeOwnerRepository;
    @Autowired
    private EmailService emailService;

    @Override
    @Transactional
    public DeviceControlDTO assignControl(DeviceControlDTO dto) {
        // Kiểm tra user và device
        UserAccount user = userAccountRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Device device = deviceRepository.findById(dto.getDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // Tìm contract của device
        Contract contract = contractRepository.findById(device.getContract().getId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        // Tìm HomeOwner liên quan đến contract
        HomeOwner homeOwner = contract.getOwner();
        if (homeOwner == null) {
            throw new RuntimeException("HomeOwner not found for this contract");
        }

        DeviceControl deviceControl = new DeviceControl();
        deviceControl.setUser(user);
        deviceControl.setDevice(device);
        deviceControl.setStartDate(LocalDateTime.now());
        deviceControl.setEndDate(dto.getEndDate());

        deviceControl = deviceControlRepository.save(deviceControl);

        return DeviceControlMapper.toDto(deviceControl);
    }

    @Override
    @Transactional
    public void assignControlRequest(assignControlRequestDTO requestDTO) {
        // Tìm homeowner theo email
        HomeOwner homeOwner = homeOwnerRepository.findByEmail(requestDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("HomeOwner not found"));

        // Tạo OTP cho user
        OTPDTO otp = otpService.createOtp(homeOwner.getId());
        if (otp == null) {
            throw new RuntimeException("Failed to create OTP");
        }

        UserAccount user = userAccountRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String message = "User " + user.getUsername() + " requested access to device " + requestDTO.getDeviceId()
                + " until " + requestDTO.getEndDate() + ".\n"
                + "Please use the OTP code to confirm the request: " + otp.getOtpCode();
        emailService.sendEmail(homeOwner.getEmail(), "Verify Device Control Permission", message);
    }

    @Override
    public boolean isControlActive(Long userId, Long deviceId) {
        return deviceControlRepository.findByUserIdAndDeviceId(userId, deviceId)
                .stream().anyMatch(control -> control.getEndDate().isAfter(LocalDateTime.now()));
    }
}
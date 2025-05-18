package com.project.IOT.controllers;

import com.project.IOT.DTOS.DeviceControlDTO;
import com.project.IOT.DTOS.assignControlRequestDTO;
import com.project.IOT.DTOS.assignControlConfirmDTO;

import com.project.IOT.Entities.HomeOwner;
import com.project.IOT.Repositories.HomeOwnerRepository;
import com.project.IOT.services.DeviceControlService;
import com.project.IOT.services.OtpService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/device-control")
public class DeviceControlController {

    private final DeviceControlService deviceControlService;
    private final OtpService otpService;
    private final HomeOwnerRepository homeOwnerRepository;

    @Autowired
    public DeviceControlController(DeviceControlService deviceControlService,
                                    OtpService otpService,
                                    HomeOwnerRepository homeOwnerRepository) {
        this.deviceControlService = deviceControlService;
        this.otpService = otpService;
        this.homeOwnerRepository = homeOwnerRepository;
    }

    @PostMapping("/assign/request")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<String> assignDevice(@RequestBody assignControlRequestDTO requestDTO) {                           
        deviceControlService.assignControlRequest(requestDTO);
        return ResponseEntity.ok("Send OTP to home owner");
    }

    @PostMapping("/assign/confirm")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<DeviceControlDTO> assignDeviceConfirm(@RequestBody assignControlConfirmDTO confirmDTO) {
        HomeOwner homeOwner = homeOwnerRepository.findByEmail(confirmDTO.getHomeOwnerEmail())
                .orElseThrow(() -> new RuntimeException("HomeOwner not found"));
        boolean isValid = otpService.verifyOtp(confirmDTO.getOtpCode(), homeOwner.getId());

        if (!isValid) {
            return ResponseEntity.badRequest().build();
        }

        DeviceControlDTO dto = new DeviceControlDTO();
        dto.setUserId(confirmDTO.getUserId());
        dto.setDeviceId(confirmDTO.getDeviceId());
        dto.setEndDate(confirmDTO.getEndDate());
        DeviceControlDTO result = deviceControlService.assignControl(dto);
        return ResponseEntity.ok(result);
    }
}
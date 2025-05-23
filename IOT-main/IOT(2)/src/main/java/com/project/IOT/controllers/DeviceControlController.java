package com.project.IOT.controllers;

import com.project.IOT.DTOS.DeviceControlDTO;
import com.project.IOT.DTOS.assignControlRequestDTO;
import com.project.IOT.DTOS.assignControlConfirmDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Device;
import com.project.IOT.Entities.HomeOwner;
import com.project.IOT.Repositories.ContractRepository;
import com.project.IOT.Repositories.DeviceRepository;
import com.project.IOT.Repositories.HomeOwnerRepository;
import com.project.IOT.services.DeviceControlService;
import com.project.IOT.services.OtpService;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/device-control")
public class DeviceControlController {

    private final DeviceControlService deviceControlService;
    private final ContractRepository contractRepository;
    private final OtpService otpService;
    private final HomeOwnerRepository homeOwnerRepository;
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceControlController(DeviceControlService deviceControlService,
                                    OtpService otpService,
                                    HomeOwnerRepository homeOwnerRepository,
                                    ContractRepository contractRepository,
                                    DeviceRepository deviceRepository) {
        this.deviceControlService = deviceControlService;
        this.otpService = otpService;
        this.homeOwnerRepository = homeOwnerRepository;
        this.contractRepository = contractRepository;
        this.deviceRepository = deviceRepository;
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
        Optional<Device> device = deviceRepository.findById(confirmDTO.getObjectId());
        if (!device.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        Contract contract = device.get().getContract();
        if (contract == null) {
            return ResponseEntity.badRequest().build();
        }
        Long ownerId = contract.getOwner().getId();
        boolean isValid = otpService.verifyOtp(confirmDTO.getOtpCode(), ownerId);

        if (!isValid) {
            return ResponseEntity.badRequest().build();
        }

        DeviceControlDTO dto = new DeviceControlDTO();
        dto.setUserId(confirmDTO.getUserId());
        dto.setDeviceId(confirmDTO.getObjectId());
        dto.setEndDate(confirmDTO.getEndDate());
        DeviceControlDTO result = deviceControlService.assignControl(dto);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/assign/unassign")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<String> unassignDevice(@RequestBody assignControlRequestDTO requestDTO) {
        Optional<Device> device = deviceRepository.findById(requestDTO.getObjectId());
        if (!device.isPresent()) {
            return ResponseEntity.badRequest().build();
        }
        deviceControlService.unassignControl(requestDTO.getUserId(), requestDTO.getObjectId()); 
        return ResponseEntity.ok("Unassign device");
    }

    @GetMapping("/is-active/{userId}/{deviceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<Boolean> isControlActive(@PathVariable Long userId, @PathVariable Long deviceId) {
        boolean isActive = deviceControlService.isControlActive(userId, deviceId);
        return ResponseEntity.ok(isActive);
    }
}
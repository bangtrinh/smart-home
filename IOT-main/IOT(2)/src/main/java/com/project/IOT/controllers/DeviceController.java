package com.project.IOT.controllers;

import com.project.IOT.DTOS.DeviceDTO;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.services.DeviceService;
import com.project.IOT.services.UserAccountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/device")
public class DeviceController {

    private final DeviceService deviceService;
    private final UserAccountService userAccountService;

    @Autowired
    public DeviceController(DeviceService deviceService, UserAccountService userAccountService) {
        this.deviceService = deviceService;
        this.userAccountService = userAccountService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<List<DeviceDTO>> getAllDevices() {
        List<DeviceDTO> devices = deviceService.getAllDevices();
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/your-devices")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<List<DeviceDTO>> getDevicesByUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserAccount user = userAccountService.findByUsername(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }
        List<DeviceDTO> devices = deviceService.getDevicesByUser(user.getId());
        if (devices.isEmpty()) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<DeviceDTO> getDeviceById(@PathVariable Long id) {
        DeviceDTO device = deviceService.findById(id);
        if (device == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(device);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public ResponseEntity<DeviceDTO> createDevice(@RequestBody DeviceDTO deviceDTO) {
        DeviceDTO savedDevice = deviceService.createDevice(deviceDTO);
        return ResponseEntity.status(201).body(savedDevice);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')")
    public ResponseEntity<DeviceDTO> updateDevice(@PathVariable Long id, @RequestBody DeviceDTO deviceDTO) {
        DeviceDTO existingDevice = deviceService.findById(id);
        if (existingDevice == null) {
            return ResponseEntity.status(404).body(null);
        }
        deviceDTO.setId(id);
        DeviceDTO updatedDevice = deviceService.updateDevice(id, deviceDTO);
        return ResponseEntity.ok(updatedDevice);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        DeviceDTO device = deviceService.findById(id);
        if (device == null) {
            return ResponseEntity.status(404).build();
        }
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }
}
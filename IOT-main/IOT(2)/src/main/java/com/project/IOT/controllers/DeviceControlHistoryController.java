package com.project.IOT.controllers;

import com.project.IOT.DTOS.DeviceControlHistoryDTO;
import com.project.IOT.Entities.DeviceControlHistory;
import com.project.IOT.services.DeviceControlHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/device-control-history")
public class DeviceControlHistoryController {

    private final DeviceControlHistoryService deviceControlHistoryService;

    @Autowired
    public DeviceControlHistoryController(DeviceControlHistoryService deviceControlHistoryService) {
        this.deviceControlHistoryService = deviceControlHistoryService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<List<DeviceControlHistoryDTO>> getAllDeviceControlHistory() {
        List<DeviceControlHistoryDTO> historyList = deviceControlHistoryService.getAllControlHistory();
        return ResponseEntity.ok(historyList);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<DeviceControlHistoryDTO> getDeviceControlHistoryById(@PathVariable Long id) {
        DeviceControlHistoryDTO history = deviceControlHistoryService.getControlHistoryById(id);
        if (history == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(history);
    }

    @GetMapping("/your-history")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<List<DeviceControlHistoryDTO>> getYourDeviceControlHistory(@AuthenticationPrincipal UserDetails userDetails) {
        List<DeviceControlHistoryDTO> historyList = deviceControlHistoryService.getHistoryByHomeOwner(userDetails.getUsername());
        return ResponseEntity.ok(historyList);
    }
}
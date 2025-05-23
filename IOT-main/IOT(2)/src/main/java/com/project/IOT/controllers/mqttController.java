package com.project.IOT.controllers;

import com.project.IOT.DTOS.MqttDTO;
import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.Entities.DeviceControl;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.services.MqttService;
import com.project.IOT.services.UserAccountService;
import com.project.IOT.Repositories.DeviceControlRepository;

import java.util.Optional;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor; 

@RestController
@RequestMapping("api/mqtt")
@RequiredArgsConstructor
public class mqttController {

    private final MqttService mqttService;
    private final UserAccountService userAccountService;
    private final DeviceControlRepository deviceControlRepository;

    @PostMapping("/controlLed")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<String> controlLed(@RequestBody MqttDTO mqttDTO, @AuthenticationPrincipal UserDetails userDetails) throws MqttException {
        // Tìm kiếm người dùng từ thông tin xác thực
        UserAccount userAccount = userAccountService.findByUsername(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(mqttService.publishMessage(mqttDTO, userAccount));
    }
    @PostMapping("/publishMessage")
    @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'MEMBER')")
    public ResponseEntity<String> publishMessage(@RequestBody MqttDTO mqttDTO, @AuthenticationPrincipal UserDetails userDetails) throws MqttException {
        // Tìm kiếm người dùng từ thông tin xác thực
        UserAccount userAccount = userAccountService.findByUsername(userDetails.getUsername());
        //Kiểm tra người dùng có quyền publish message hay không
        Optional<DeviceControl> deviceControl = deviceControlRepository.findByUserIdAndDeviceId(userAccount.getId(), mqttDTO.getDeviceId());
        if (!deviceControl.isPresent()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have permission to publish message");
        }
        return ResponseEntity.status(HttpStatus.OK).body(mqttService.publishMessage(mqttDTO, userAccount));
    }
}
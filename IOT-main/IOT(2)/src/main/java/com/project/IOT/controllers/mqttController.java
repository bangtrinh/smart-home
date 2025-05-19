package com.project.IOT.controllers;

import com.project.IOT.DTOS.MqttDTO;
import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.services.MqttService;
import com.project.IOT.services.UserAccountService;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("api/mqtt")
@RequiredArgsConstructor
public class mqttController {

    private final MqttService mqttService;
    private final UserAccountService userAccountService;

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
        return ResponseEntity.status(HttpStatus.OK).body(mqttService.publishMessage(mqttDTO, userAccount));
    }
}
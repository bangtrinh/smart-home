package com.project.IOT.controllers;

import java.util.List;

import com.project.IOT.dtos.MqttDTO;
import com.project.IOT.services.MqttService;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("api/mqtt")
@RequiredArgsConstructor
public class mqttController {

    private final MqttService mqttService;

    @GetMapping("/getAll")
    public ResponseEntity<List<MqttDTO>> getAllCategories() {
        return ResponseEntity.ok(mqttService.getAllData());
    }
    @PostMapping("/controlLed")
    public ResponseEntity<String> controlLed(@RequestBody MqttDTO mqttDTO) throws MqttException {
        return ResponseEntity.status(HttpStatus.OK).body(mqttService.publishMessage(mqttDTO));
    } 
    @PostMapping("/publishMessage")
    public ResponseEntity<String> publishMessage(@RequestBody MqttDTO mqttDTO) throws MqttException {
        return ResponseEntity.status(HttpStatus.OK).body(mqttService.publishMessage(mqttDTO));
    }
}

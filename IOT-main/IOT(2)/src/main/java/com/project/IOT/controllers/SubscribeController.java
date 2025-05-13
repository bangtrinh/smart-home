package com.project.IOT.controllers;

import java.util.List;

import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.IOT.dtos.SubscribeDTO;
import com.project.IOT.dtos.TopicDTO;
import com.project.IOT.services.SubscribeService;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("api/subscribe")
@RequiredArgsConstructor
public class SubscribeController {
    private final SubscribeService subscribeService;
    
    @GetMapping("/getAllSubscriptionsByUserId")
    public ResponseEntity<List<TopicDTO>> getAllSubscriptionsByUserId(@RequestParam Long userId) {
        List<TopicDTO> subscriptions = subscribeService.getAllSubscriptionsByUserId(userId);
        return ResponseEntity.ok(subscriptions);
    }

    @PostMapping("/subscribeToTopic")
    public ResponseEntity<String> subscribeToTopic(@RequestBody SubscribeDTO subscribeDTO) throws MqttException{
        String response = subscribeService.subscribeToTopic(subscribeDTO);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/unsubscribeToTopic")
    public ResponseEntity<String> unsubscribeToTopic(@RequestBody SubscribeDTO subscribeDTO) throws MqttException{
        String response = subscribeService.unsubscribeTopic(subscribeDTO);
        return ResponseEntity.ok(response);
    }
}

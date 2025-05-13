package com.project.IOT.controllers;

import com.project.IOT.dtos.TopicDTO;
import com.project.IOT.services.TopicService;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("api/topic")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping("/getAll")
    public ResponseEntity<List<TopicDTO>> getAllTopic(){
        return ResponseEntity.status(HttpStatus.OK).body(topicService.getAllTopic());
    }
    @PostMapping("/subscribeToTopic")
    public ResponseEntity<String> subscribeToTopic(@RequestBody TopicDTO topicDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(topicService.subscribeToTopic(topicDTO));
    }
    @PostMapping("/unsubscribeToTopic")
    public ResponseEntity<String> unsubscribeToTopic(@RequestBody TopicDTO topicDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(topicService.unsubscribeTopic(topicDTO));
    }

    @PutMapping("/updateTopic/{topicId}")
    public ResponseEntity<String> updateTopic(@PathVariable int topicId, @RequestBody TopicDTO topicDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(topicService.updateTopic(topicId, topicDTO.getName(), topicDTO.getPath()));
    }
}

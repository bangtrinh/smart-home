package com.project.IOT.services;
import com.project.IOT.dtos.TopicDTO;
import org.eclipse.paho.client.mqttv3.MqttException;

import java.util.List;

public interface TopicService {
    List<TopicDTO> getAllTopic();
    String subscribeToTopic(TopicDTO topicDTO) throws MqttException;
    String unsubscribeTopic(TopicDTO topicDTO) throws MqttException;
    String updateTopic(int topicId, String newName, String newPath) throws MqttException;
    
}

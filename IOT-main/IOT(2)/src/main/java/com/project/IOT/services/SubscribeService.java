package com.project.IOT.services;
import com.project.IOT.dtos.SubscribeDTO;
import com.project.IOT.dtos.TopicDTO;

import java.util.List;

import org.eclipse.paho.client.mqttv3.MqttException;

public interface SubscribeService {
    List<TopicDTO> getAllSubscriptionsByUserId(Long userId);
    String subscribeToTopic(SubscribeDTO subscribeDTO) throws MqttException;
    String unsubscribeTopic(SubscribeDTO subscribeDTO) throws MqttException;
}

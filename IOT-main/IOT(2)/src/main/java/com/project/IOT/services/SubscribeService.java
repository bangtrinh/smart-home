package com.project.IOT.services;
import com.project.IOT.dtos.SubscribeDTO;
import com.project.IOT.dtos.TopicDTO;

import java.util.List;

public interface SubscribeService {
    List<TopicDTO> getAllSubscriptionsByUserId(Long userId);
    String subscribeToTopic(SubscribeDTO subscribeDTO);
    String unsubscribeTopic(SubscribeDTO subscribeDTO);
}

package com.project.IOT.services;
import com.project.IOT.dtos.TopicDTO;

import java.util.List;

public interface TopicService {
    List<TopicDTO> getAllTopic();
    String subscribeToTopic(TopicDTO topicDTO);
    String unsubscribeTopic(TopicDTO topicDTO);
    String updateTopic(int topicId, String newName, String newPath);
    
}

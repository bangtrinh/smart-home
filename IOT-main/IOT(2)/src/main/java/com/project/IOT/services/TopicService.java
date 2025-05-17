package com.project.IOT.services;
import java.util.List;

import com.project.IOT.DTOS.TopicDTO;

public interface TopicService {
    List<TopicDTO> getAllTopic();
    String subscribeToTopic(TopicDTO topicDTO);
    String unsubscribeTopic(TopicDTO topicDTO);
    String updateTopic(int topicId, String newName, String newPath);
    
}

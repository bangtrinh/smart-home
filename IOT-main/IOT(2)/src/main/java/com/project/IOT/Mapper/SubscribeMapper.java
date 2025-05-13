package com.project.IOT.Mapper;

import com.project.IOT.dtos.SubscribeDTO;
import com.project.IOT.entities.Subscribe;
import com.project.IOT.entities.Topic;
import com.project.IOT.entities.User;

public class SubscribeMapper {
    public SubscribeDTO toDTO(Subscribe subscribe) {
        return SubscribeDTO.builder()
                .id(subscribe.getId())
                .userId(subscribe.getUser().getId())
                .topicId(subscribe.getTopic().getId())
                .build();
    }

    public Subscribe toEntity(SubscribeDTO subscribeDTO, User user, Topic topic) {
        return Subscribe.builder()
                .user(user)
                .topic(topic)
                .build();        
    }
}

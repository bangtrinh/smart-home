package com.project.IOT.Mapper;

import com.project.IOT.DTOS.TopicDTO;
import com.project.IOT.Entities.Topic;

import org.springframework.stereotype.Component;

@Component
public class TopicMapper {
    public TopicDTO toDTO(Topic topic) {
        return TopicDTO.builder()
                .id(topic.getId())
                .name(topic.getName())
                .latest_data(topic.getLatest_data() != null ? topic.getLatest_data() : "No Data")
                .build();
    }

    public Topic toEntity(TopicDTO topicDTO) {
        return Topic.builder()
                .name(topicDTO.getName())
                .path(topicDTO.getPath())
                .build();
    }
}

package com.project.IOT.services.Impl;

import com.project.IOT.DTOS.TopicDTO;
import com.project.IOT.Entities.Topic;
import com.project.IOT.Mapper.TopicMapper;
import com.project.IOT.Repositories.TopicRepository;
import com.project.IOT.services.TopicService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    @Override
    public List<TopicDTO> getAllTopic() {
        List<Topic> topics = topicRepository.findAll();
        List<TopicDTO> topicDTOS = new ArrayList<>();
        for (Topic topic : topics) {
            if(topic != null){
                topicDTOS.add(new TopicDTO(topic.getId()
                        ,topic.getName(),
                        topic.getPath(),
                        topic.getLatest_data() != null ? topic.getLatest_data() : "No Data"));
            }
        }
        return topicDTOS;
    }

    @Override
    public String subscribeToTopic(TopicDTO topicDTO) {
        Optional<Topic> existingTopic = topicRepository.findFirstByPath(topicDTO.getPath());
        Topic topic;
        if (existingTopic.isPresent()) {
            topic = existingTopic.get();
            if(topic != null){
                return "Topic đã được subscribed: " + topicDTO.getPath();
            }
        } else {
            topic = topicMapper.toEntity(topicDTO);
            topic.setLatest_data("*A: 0");
        }
        topicRepository.save(topic);
        return "Subscribed to topic: " + topicDTO.getPath();
    }

    @Override
    public String unsubscribeTopic(TopicDTO topicDTO){
        Topic existingTopic = topicRepository.findById(topicDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with Id: " + topicDTO.getId()));
        if (existingTopic != null) {
            //delete topic
            topicRepository.delete(existingTopic);
        }
            //unsubscribe topic}
        return "Unsubscribed to topic: " + topicDTO.getPath();
    }

    @Override
    public String updateTopic(int topicId, String newName, String newPath) {
        // Tìm kiếm topic theo ID từ cơ sở dữ liệu
        Topic existingTopic = topicRepository.findById((long) topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with Id: " + topicId));

        // Cập nhật tên và path của topic
        existingTopic.setName(newName);
        existingTopic.setPath(newPath);

        // Lưu lại vào cơ sở dữ liệu
        topicRepository.save(existingTopic);

        // Nếu topic đang được subscribe, cần phải unsubscribe và subscribe lại với đường dẫn mới

        return "Topic updated successfully";
    }
}

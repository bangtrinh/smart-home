package com.project.IOT.services.Impl;

import com.project.IOT.Mapper.TopicMapper;
import com.project.IOT.dtos.TopicDTO;
import com.project.IOT.entities.Topic;
import com.project.IOT.responsitories.TopicRepository;
import com.project.IOT.services.TopicService;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TopicServiceImpl implements TopicService {

    private final MqttClient mqttClient;
    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;

    @PostConstruct
    public void resubscribeTopics() {
        try {
            List<Topic> topics = topicRepository.findAll();  // Lấy tất cả các topic từ database
            for (Topic topic : topics) {
                if (topic.getSubscribe()) {  // Chỉ subscribe lại các topic đã đăng ký trước đó
                    mqttClient.subscribe(topic.getPath());
                    System.out.println("Re-subscribed to topic: " + topic.getPath());
                }
            }
        } catch (MqttException e) {
            System.err.println("Error while subscribing topics: " + e.getMessage());
        }
    }

    @Override
    public List<TopicDTO> getAllTopic() {
        List<Topic> topics = topicRepository.findAll();
        List<TopicDTO> topicDTOS = new ArrayList<>();
        for (Topic topic : topics) {
            if(topic.getSubscribe()){
                topicDTOS.add(new TopicDTO(topic.getId()
                        ,topic.getName(),
                        topic.getPath(),
                        topic.getLatest_data() != null ? topic.getLatest_data() : "No Data"));
            }
        }
        return topicDTOS;
    }

    @Override
    public String subscribeToTopic(TopicDTO topicDTO) throws MqttException {
        Optional<Topic> existingTopic = topicRepository.findFirstByPath(topicDTO.getPath());
        Topic topic;
        if (existingTopic.isPresent()) {
            topic = existingTopic.get();
            if(topic.getSubscribe()){
                return "Topic đã được subscribed: " + topicDTO.getPath();
            }
            topic.setSubscribe(true);
        } else {
            topic = topicMapper.toEntity(topicDTO);
            topic.setSubscribe(true);
        }
        topicRepository.save(topic);
        mqttClient.subscribe(topicDTO.getPath());
        return "Subscribed to topic: " + topicDTO.getPath();
    }

    @Override
    public String unsubscribeTopic(TopicDTO topicDTO) throws MqttException {
        Topic existingTopic = topicRepository.findById(topicDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with Id: " + topicDTO.getId()));
        if (existingTopic != null) {
            existingTopic.setSubscribe(false);
            topicRepository.save(existingTopic);
            mqttClient.unsubscribe(topicDTO.getPath());
        }
        return "Unsubscribed to topic: " + topicDTO.getPath();
    }

    @Override
    public String updateTopic(int topicId, String newName, String newPath) throws MqttException {
        // Tìm kiếm topic theo ID từ cơ sở dữ liệu
        Topic existingTopic = topicRepository.findById((long) topicId)
                .orElseThrow(() -> new EntityNotFoundException("Topic not found with Id: " + topicId));

        // Cập nhật tên và path của topic
        existingTopic.setName(newName);
        existingTopic.setPath(newPath);

        // Lưu lại vào cơ sở dữ liệu
        topicRepository.save(existingTopic);

        // Nếu topic đang được subscribe, cần phải unsubscribe và subscribe lại với đường dẫn mới
        if (existingTopic.getSubscribe()) {
            mqttClient.unsubscribe(existingTopic.getPath());
            mqttClient.subscribe(newPath);
            System.out.println("Topic path updated and re-subscribed: " + newPath);
        }

        return "Topic updated successfully";
    }
}

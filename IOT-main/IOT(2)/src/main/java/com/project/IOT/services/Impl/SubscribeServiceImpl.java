package com.project.IOT.services.Impl;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.IOT.dtos.SubscribeDTO;
import com.project.IOT.dtos.TopicDTO;
import com.project.IOT.entities.Subscribe;
import com.project.IOT.entities.Topic;
import com.project.IOT.entities.User;
import com.project.IOT.responsitories.SubscribeRepository;
import com.project.IOT.responsitories.TopicRepository;
import com.project.IOT.responsitories.UserRepository;
import com.project.IOT.services.SubscribeService;
import com.project.IOT.services.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubscribeServiceImpl implements SubscribeService {

    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final SubscribeRepository subscribeRepository;

    // Implement the methods from SubscribeService interface here
    @Override
    public List<TopicDTO> getAllSubscriptionsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Subscribe> subscribes = subscribeRepository.findByUserId(user.getId());
        
        List<TopicDTO> topicDTOS = new ArrayList<>();
        
        for (Subscribe subscribe : subscribes) {
            Topic topic = subscribe.getTopic();  
            
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
    public String subscribeToTopic(SubscribeDTO subscribeDTO) {
        Optional<Subscribe> existingSubscribe = subscribeRepository
                                                .findByUserIdAndTopicId(
                                                subscribeDTO.getUserId(),
                                                subscribeDTO.getTopicId());                                    
        Subscribe subscribe;
        if (existingSubscribe.isPresent()) {
            subscribe = existingSubscribe.get();
            if(subscribe != null){
                return "Topic đã được subscribed: " + subscribeDTO.getTopicId();
            }
        } else {
            User user = userRepository.findById(subscribeDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            Topic topic = topicRepository.findById(subscribeDTO.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
            subscribe = new Subscribe();
            subscribe.setUser(user);
            subscribe.setTopic(topic);
        }
        subscribeRepository.save(subscribe);
        return "Subscribed to topic: " + subscribeDTO.getTopicId();       
    }

    @Override
    public String unsubscribeTopic(SubscribeDTO subscribeDTO) {
        Subscribe existingSubscribe = subscribeRepository
                .findByUserIdAndTopicId(subscribeDTO.getUserId(), subscribeDTO.getTopicId())
                .orElseThrow(() -> new RuntimeException("Subscription not found"));
        if (existingSubscribe != null) {
            subscribeRepository.delete(existingSubscribe);
            return "Unsubscribed from topic: " + subscribeDTO.getTopicId();
        }
        return null;
    }    
}

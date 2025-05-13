package com.project.IOT.responsitories;

import java.util.List;
import com.project.IOT.entities.Subscribe;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SubscribeRepository extends JpaRepository<Subscribe, Long> {
    Optional<Subscribe> findByUserIdAndTopicId(Long userId, Long topicId);
    List<Subscribe> findByUserId(Long userId);
    List<Subscribe> findByTopicId(Long topicId);  
}

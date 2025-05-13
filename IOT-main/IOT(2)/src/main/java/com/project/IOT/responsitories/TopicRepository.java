package com.project.IOT.responsitories;

import com.project.IOT.entities.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findFirstByPath(String path);
    Optional<Topic> findById(Long id);
}

package com.project.IOT.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.IOT.Entities.Topic;

import java.util.Optional;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    Optional<Topic> findFirstByPath(String path);
    Optional<Topic> findById(Long id);
}

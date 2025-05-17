package com.project.IOT.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.IOT.Entities.Mqtt;

public interface MqttResponsitory extends JpaRepository<Mqtt, Long> {

}

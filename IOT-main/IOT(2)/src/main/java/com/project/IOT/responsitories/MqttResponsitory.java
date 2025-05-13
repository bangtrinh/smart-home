package com.project.IOT.responsitories;

import com.project.IOT.entities.Mqtt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MqttResponsitory extends JpaRepository<Mqtt, Long> {

}

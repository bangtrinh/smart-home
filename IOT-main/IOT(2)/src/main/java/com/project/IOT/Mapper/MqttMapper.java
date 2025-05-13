package com.project.IOT.Mapper;

import com.project.IOT.dtos.MqttDTO;
import com.project.IOT.entities.Mqtt;
import com.project.IOT.entities.Topic;
import org.springframework.stereotype.Component;

@Component
public class MqttMapper {
    public MqttDTO toDTO(Mqtt mqtt) {
        return MqttDTO.builder()
                .idTopic(mqtt.getId())
                .value(mqtt.getValue())
                .build();
    }

    public Mqtt toEntity(MqttDTO mqttDTO, Topic topic) {
        return Mqtt.builder()
                .topic(topic)
                .value(mqttDTO.getValue())
                .build();
    }
}

package com.project.IOT.services;

import com.project.IOT.dtos.MqttDTO;
import org.eclipse.paho.client.mqttv3.MqttException;

import java.util.List;

public interface MqttService {
    List<MqttDTO> getAllData();
    String publishMessage(MqttDTO mqttDTO) throws MqttException;
}
            
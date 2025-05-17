package com.project.IOT.services;

import org.eclipse.paho.client.mqttv3.MqttException;

import com.project.IOT.DTOS.MqttDTO;

import java.util.List;

public interface MqttService {
    List<MqttDTO> getAllData();
    String publishMessage(MqttDTO mqttDTO) throws MqttException;
}
            
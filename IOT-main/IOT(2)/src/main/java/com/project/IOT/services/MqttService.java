package com.project.IOT.services;

import org.eclipse.paho.client.mqttv3.MqttException;

import com.project.IOT.DTOS.MqttDTO;
import com.project.IOT.Entities.UserAccount;

public interface MqttService {
    String publishMessage(MqttDTO mqttDTO, UserAccount userAccount) throws MqttException;
}
            
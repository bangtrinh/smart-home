package com.project.IOT.listener;

import com.project.IOT.DTOS.MqttDTO;

import org.eclipse.paho.client.mqttv3.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;


@Component
public class MqttListener {

    private final SimpMessagingTemplate messagingTemplate;

    public MqttListener(MqttClient mqttClient, SimpMessagingTemplate messagingTemplate) throws MqttException {
        this.messagingTemplate = messagingTemplate;

        mqttClient.setCallback(new MqttCallback() {
            @Override
            public void connectionLost(Throwable cause) {
                System.out.println("MQTT Connection lost!");
            }   

            @Override
            public void messageArrived(String topic, MqttMessage message) throws MqttException {
                String payload = new String(message.getPayload());
                System.out.println("Received from topic [" + topic + "]: " + payload);

                String[] parts = topic.split("/");
                Long contractId = Long.valueOf(parts[2]);
                Long deviceId = Long.valueOf(parts[4]);

                // Gửi dữ liệu qua WebSocket
                MqttDTO mqttDTO = new MqttDTO(
                        payload,
                        deviceId,
                        contractId
                );
                messagingTemplate.convertAndSend("/topic/mqtt", mqttDTO);
            }

            @Override
            public void deliveryComplete(IMqttDeliveryToken token) {
                System.out.println("Message delivered!");
                
            }
        });

        mqttClient.subscribe("/contract/+/device/+");
    }
}


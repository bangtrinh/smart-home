package com.project.IOT.Config;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class MqttConfig {
    private static final String BROKER_URL = "tcp://localhost:1883";
    private static final String CLIENT_ID = "springMqttClient";
    private static final String USERNAME = "IoTClient"; //nếu Mqtt có cài mật khẩu thì nhận username và pass dô
    private static final String PASSWORD = "IoTPass";

    @Bean
    public MqttClient mqttClient() throws MqttException {
        MqttClient client = new MqttClient(BROKER_URL, CLIENT_ID);
        MqttConnectOptions options = new MqttConnectOptions();
        options.setUserName(USERNAME);
        options.setPassword(PASSWORD.toCharArray());
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        client.connect(options);
        return client;
    }
}

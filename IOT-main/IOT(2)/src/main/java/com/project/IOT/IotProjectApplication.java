package com.project.IOT;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class IotProjectApplication {
	public static void main(String[] args) {
		SpringApplication.run(IotProjectApplication.class, args);
	}
}

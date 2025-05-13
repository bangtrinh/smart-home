package com.project.IOT.dtos;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MqttDTO {
    private long idTopic;
    private String value;
}

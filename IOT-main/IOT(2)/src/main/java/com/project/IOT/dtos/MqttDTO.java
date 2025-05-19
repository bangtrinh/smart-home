package com.project.IOT.DTOS;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MqttDTO {
    private String value;
    private Long deviceId;
    private Long contractId;
}

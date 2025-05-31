package com.project.IOT.DTOS;

import java.time.LocalDateTime;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class NotificationMessage {
    private Long contractId;
    private Long userId;
    private Long deviceId;
    private String value;
    private String message;
    private LocalDateTime timestamp;
}

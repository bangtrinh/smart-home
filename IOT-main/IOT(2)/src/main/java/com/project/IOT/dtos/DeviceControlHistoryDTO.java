package com.project.IOT.DTOS;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DeviceControlHistoryDTO {
    private Long historyId;
    private Long userId;
    private Long deviceId;
    private Long contractId;
    private String action;
    private LocalDateTime actionTimestamp;
}

package com.project.IOT.DTOS;

import lombok.Data;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OTPDTO {
    private Long otpId;
    private Long ownerId;
    private String otpCode;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Boolean used;
}

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
public class PasswordResetTokenDTO {
    private Long tokenId;
    private Long userId;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Boolean used;
}

package com.project.IOT.DTOS;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Data
public class ResetPasswordRequest {
    private String email;
    private String token;
    private String newPassword;
}

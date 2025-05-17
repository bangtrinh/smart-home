
package com.project.IOT.DTOS;

import lombok.Data;

@Data
public class ResetPasswordConfirmDTO {
    private String token;
    private String newPassword;
}

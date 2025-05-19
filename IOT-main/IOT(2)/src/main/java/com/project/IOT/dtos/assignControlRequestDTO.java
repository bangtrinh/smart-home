package com.project.IOT.DTOS;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Data
public class assignControlRequestDTO {
    String email;
    Long objectId;
    Long userId;
    String objectCode;
    String endDate;
}

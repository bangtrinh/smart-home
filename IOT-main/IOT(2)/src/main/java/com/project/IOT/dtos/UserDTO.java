package com.project.IOT.DTOS;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


import java.util.Set;
@Getter
@Setter
@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Set<String> roles;
}
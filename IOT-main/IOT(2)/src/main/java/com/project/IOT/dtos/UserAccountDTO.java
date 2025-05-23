package com.project.IOT.DTOS;

import java.util.Set;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAccountDTO {
    private Long id;
    private Set<Long> contracts;
    private String username;
    private String email;
    private String password;
    private Set<String> roles;
}

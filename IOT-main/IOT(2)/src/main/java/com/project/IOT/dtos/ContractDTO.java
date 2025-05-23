package com.project.IOT.DTOS;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

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
public class ContractDTO {
    private Long contractId;
    private String contractCode;
    private Long ownerId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Set<Long> users; // Danh sách user liên kết với contract này
}

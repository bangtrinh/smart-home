package com.project.IOT.Mapper;

import java.util.stream.Collectors;

import com.project.IOT.DTOS.ContractDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.HomeOwner;

public class ContractMapper {
    // Convert Contract entity to ContractDTO
    public static ContractDTO toDto(Contract contract) {
        return ContractDTO.builder()
                .contractId(contract.getId())
                .contractCode(contract.getContractCode())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .status(contract.getStatus())
                .ownerId(contract.getOwner() != null ? contract.getOwner().getId() : null)
                .build();
    }


    // Convert ContractDTO to Contract entity
    public static Contract toEntity(ContractDTO dto, HomeOwner owner) {
        return Contract.builder()
                .id(dto.getContractId())
                .contractCode(dto.getContractCode())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus())
                .owner(owner)
                .build();
    }    
}

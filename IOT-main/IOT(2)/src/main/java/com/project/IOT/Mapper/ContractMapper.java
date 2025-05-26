package com.project.IOT.Mapper;

import java.util.stream.Collectors;

import com.project.IOT.DTOS.ContractDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.HomeOwner;
import com.project.IOT.Entities.UserAccount;

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
                .users(contract.getUsers() != null ? 
                        contract.getUsers().stream()
                                .map(user -> UserAccountMapper.toDto(user))
                                .collect(Collectors.toSet()) : null)
                .owner(contract.getOwner() != null ?
                        HomeOwnerMapper.toDto(contract.getOwner()) : null)
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
                .users(dto.getUsers() != null ? 
                        dto.getUsers().stream()
                                .map(userDto -> {
                                    UserAccount user = UserAccountMapper.toEntity(userDto);
                                    return user;
                                })
                                .collect(Collectors.toSet()) : null)
                .build();
    }    
}

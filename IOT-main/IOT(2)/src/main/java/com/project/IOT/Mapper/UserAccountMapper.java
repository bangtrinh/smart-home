package com.project.IOT.Mapper;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.Entities.Contract;
import com.project.IOT.Entities.Role;
import com.project.IOT.Entities.UserAccount;
import com.project.IOT.Repositories.ContractRepository;
import com.project.IOT.Repositories.RoleRepository;

@Component
public class UserAccountMapper {
    private static RoleRepository roleRepository;
    private static ContractRepository contractRepository;

    public UserAccountMapper(RoleRepository roleRepository, ContractRepository contractRepository) {
        UserAccountMapper.roleRepository = roleRepository;
        UserAccountMapper.contractRepository = contractRepository;
    }

    public static UserAccountDTO toDto(UserAccount entity) {
    if (entity == null) return null;

    return UserAccountDTO.builder()
        .id(entity.getId())
        .username(entity.getUsername())
        .email(entity.getEmail())
        .roles(entity.getRoles() != null
            ? entity.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet())
            : new HashSet<>())
        .build();
    }


    public static UserAccount toEntity(UserAccountDTO dto) {

        UserAccount entity = new UserAccount();
        entity.setId(dto.getId());
        entity.setUsername(dto.getUsername());
        entity.setEmail(dto.getEmail());
        if (dto.getRoles() != null) {
            Set<Role> roles = dto.getRoles().stream()
                    .map(roleRepository::findByName)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .collect(Collectors.toSet());
            entity.setRoles(roles);
        }
        if(dto.getContractId() != null) {
            Contract contract = contractRepository.findById(dto.getContractId())
                    .orElseThrow(() -> new RuntimeException("Contract not found"));
            entity.setContract(contract);
        }
        return entity;
    }
}


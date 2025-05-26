package com.project.IOT.services;

import java.util.List;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;

import com.project.IOT.DTOS.ContractDTO;
import com.project.IOT.DTOS.UserAccountDTO;
import com.project.IOT.DTOS.assignControlConfirmDTO;
import com.project.IOT.DTOS.assignControlRequestDTO;
public interface ContractService {
    ContractDTO findById(Long contractId);
    List<ContractDTO> getAllContracts();
    List<ContractDTO> getContractsByUser(Long userId);
    ContractDTO createContract(ContractDTO dto);
    ContractDTO updateContract(Long contractId, ContractDTO dto);
    void deleteContract(Long contractId);
    void requestLinkToContract(assignControlRequestDTO requestDTO);
    void confirmLinkToContract(assignControlConfirmDTO confirmDTO);
    boolean isUserLinkedToContract(Long userId, String contractCode); 
    List<UserAccountDTO> getUsersByContract(Long contractId);  
    List<ContractDTO> getContractsByHomeOwner(Long ownerId);
    void unLinkToContract(Long userId, String contractCode);
}

package com.project.IOT.services;

import java.util.List;

import com.project.IOT.DTOS.ContractDTO;
import com.project.IOT.DTOS.assignControlConfirmDTO;
import com.project.IOT.DTOS.assignControlRequestDTO;
public interface ContractService {
    ContractDTO findById(Long contractId);
    List<ContractDTO> getAllContracts();
    ContractDTO getContractsByUser(Long userId);
    ContractDTO createContract(ContractDTO dto);
    ContractDTO updateContract(Long contractId, ContractDTO dto);
    void deleteContract(Long contractId);
    void requestLinkToContract(assignControlRequestDTO requestDTO);
    void confirmLinkToContract(assignControlConfirmDTO confirmDTO);
}

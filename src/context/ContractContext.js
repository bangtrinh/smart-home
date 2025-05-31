import React, { createContext, useContext, useState, useEffect } from 'react';

const ContractContext = createContext();

export const useContract = () => useContext(ContractContext);

export const ContractProvider = ({ children }) => {
  const [selectedContractId, setSelectedContractIdState] = useState(null);

  useEffect(() => {
    const savedContractId = localStorage.getItem('selectedContractId');
    if (savedContractId) {
      setSelectedContractIdState(savedContractId);
    }
  }, []);

  const setSelectedContractId = (contractId) => {
    localStorage.setItem('selectedContractId', contractId);
    setSelectedContractIdState(contractId);
  };

  return (
    <ContractContext.Provider value={{ selectedContractId, setSelectedContractId }}>
      {children}
    </ContractContext.Provider>
  );
};

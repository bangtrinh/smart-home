import React, { createContext, useContext } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const WebSocketContext = createContext();

export const useWS = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const ws = useWebSocket(token);

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

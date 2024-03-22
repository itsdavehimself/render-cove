import React, { createContext, ReactNode } from 'react';
import { Socket } from 'socket.io-client';

interface SocketContextProps {
  children: ReactNode;
  socket: Socket | null;
}

export const SocketContext = createContext<Socket | null>(null);

const SocketContextProvider: React.FC<SocketContextProps> = ({
  children,
  socket,
}: SocketContextProps) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContextProvider;

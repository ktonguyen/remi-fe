import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { io } from 'socket.io-client';
import Message from 'containers/Message';
interface BroadcastContextType {
  broadcastValue: any;
  broadcast: (value: any) => void;
}

export const BroadcastContext = createContext<BroadcastContextType | undefined>(undefined);

interface BroadcastProviderProps {
  children: ReactNode;
}

export const BroadcastProvider: React.FC<BroadcastProviderProps> = ({ children }) => {
  const [broadcastValue, setBroadcastValue] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const broadcast = (value: any) => {};
  useEffect(() => {
    const socket = io('ws://localhost:8080');

    socket.on('connect', () => {
    });

    socket.on('shareVideo', (message) => {
        setOpen(true);
        setMessage(`Video: ${message.title} has been shared by ${message.shareBy}`);
        setBroadcastValue(message);
        
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <BroadcastContext.Provider value={{ broadcastValue, broadcast }}>
      {children}
      <Message open={open} message={message} type="info" onClose={() => { setOpen(false) }} />
    </BroadcastContext.Provider>
  );
};

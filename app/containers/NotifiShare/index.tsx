import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Message from 'containers/Message';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('An error occurred');
  useEffect(() => {
    const socket = io('ws://localhost:8080');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('shareVideo', (message) => {
        setOpen(true);
        setMessage(`Video: ${message.title} has been shared by ${message.shareBy}`);
        
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
        <Message open={open} message={message} type="info" onClose={() => { setOpen(false) }} />
    </>
  );
}

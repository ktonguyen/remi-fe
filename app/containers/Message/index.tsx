import React, { useEffect, useState, forwardRef, Ref } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props: AlertProps,
  ref: Ref<HTMLDivElement>,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface MessageProps {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const Message: React.FC<MessageProps> = ({ open, message, type, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Message;

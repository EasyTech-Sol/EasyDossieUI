// src/contexts/SnackbarContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';
import { AlertColor } from '@mui/material';

interface SnackbarContextType {
  open: boolean;
  message: string;
  severity: AlertColor;
  setOpen: (value: boolean) => void;
  setMessage: (msg: string) => void;
  setSeverity: (level: AlertColor) => void;
  showMessage: (msg: string, level?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info');

  const showMessage = (msg: string, level: AlertColor = 'info') => {
    setMessage(msg);
    setSeverity(level);
    setOpen(true);
  };

   return (
    <SnackbarContext.Provider
      value={{ open, setOpen, message, setMessage, severity, setSeverity, showMessage }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

import { createContext, useContext, useState, ReactNode } from 'react';

interface ErrorContextType {
  error: boolean;
  setError: (boolean: boolean) => void;
  errorMessage: string;
  setErrorMessage: (string: string) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("")

  return (
    <ErrorContext.Provider value={{ error, setError, errorMessage, setErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};

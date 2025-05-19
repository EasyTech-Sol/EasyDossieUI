import React, { createContext, useContext, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { apiService } from '../services/easydossie.service';

type DossierContextType = {
  dossiers: Dossier[];
  setDossiers: React.Dispatch<React.SetStateAction<Dossier[]>>;
  loading: boolean;
};

const DossierContext = createContext<DossierContextType | undefined>(undefined);

export const DossierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  
  useEffect(() => {
    const fetchDossiers = async () => {
      setLoading(true);
      try {
        const result = await apiService.getDossiers();
        setDossiers(result.data.dossiers);
      } catch (error) {
        if (isAxiosError(error)) {
          console.error(`Erro ao listar dossiês: ${error.message}`);
          // Adicione lógica de snackbar aqui se desejar
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDossiers();
  }, []);

  return (
    <DossierContext.Provider
      value={{ dossiers, setDossiers, loading}}
    >
      {children}
    </DossierContext.Provider>
  );
};

export const useDossiers = () => {
  const context = useContext(DossierContext);
  if (!context) {
    throw new Error('useDossiers deve ser usado dentro de um DossierProvider');
  }
  return context;
};

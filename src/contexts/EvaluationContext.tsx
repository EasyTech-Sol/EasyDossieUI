import React, { createContext, useContext, useState, ReactNode } from 'react';

type EvaluationContextType = {
  evaluations: Evaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
  dossierTemplate: Dossier | undefined;
  setDossierTemplate: React.Dispatch<React.SetStateAction<Dossier | undefined>>;
};

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const EvaluationProvider = ({ children }: { children: ReactNode }) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [dossierTemplate, setDossierTemplate] = useState<Dossier | undefined>(undefined);

  return (
    <EvaluationContext.Provider
      value={{ evaluations, setEvaluations, dossierTemplate, setDossierTemplate }}
    >
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluationContext = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluationContext must be used within an EvaluationProvider');
  }
  return context;
};

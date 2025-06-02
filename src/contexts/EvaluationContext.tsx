import React, { createContext, useContext, useState, ReactNode } from 'react';

type EvaluationContextType = {
  evaluations: Evaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
  dossierTemplate: Dossier | undefined;
  setDossierTemplate: React.Dispatch<React.SetStateAction<Dossier | undefined>>;
  hasEvaluationUpdated: boolean
  setHasEvaluationUpdated: React.Dispatch<React.SetStateAction<boolean>>;
};

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const EvaluationProvider = ({ children }: { children: ReactNode }) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [dossierTemplate, setDossierTemplate] = useState<Dossier | undefined>(undefined);
  const [hasEvaluationUpdated, setHasEvaluationUpdated] = useState(false)

  return (
    <EvaluationContext.Provider
      value={{
        evaluations, setEvaluations, dossierTemplate,
        setDossierTemplate, hasEvaluationUpdated, setHasEvaluationUpdated
      }}
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

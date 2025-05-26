import React, { createContext, useContext, useState, ReactNode } from 'react';

type EvaluationContextType = {
  evaluations: Evaluation[];
  setEvaluations: React.Dispatch<React.SetStateAction<Evaluation[]>>;
};

const EvaluationContext = createContext<EvaluationContextType | undefined>(undefined);

export const EvaluationProvider = ({ children }: { children: ReactNode }) => {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  return (
    <EvaluationContext.Provider value={{ evaluations, setEvaluations}}>
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

import { createContext, useContext, useState, ReactNode } from "react";

type Student = {
  id: number;
  name: string;
  registration: string | number;
};

type StudentContextType = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);

  return (
    <StudentContext.Provider value={{ students, setStudents }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = (): StudentContextType => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext deve ser usado dentro de um StudentProvider");
  }
  return context;
};

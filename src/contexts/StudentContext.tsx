import { createContext, useContext, useState, ReactNode } from "react";

type StudentContextType = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  selectedStudentIndex: number;
  setSelectedStudentIndex: React.Dispatch<React.SetStateAction<number>>;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);

  return (
    <StudentContext.Provider
      value={{
        students,
        setStudents,
        selectedStudentIndex,
        setSelectedStudentIndex,
      }}
    >
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

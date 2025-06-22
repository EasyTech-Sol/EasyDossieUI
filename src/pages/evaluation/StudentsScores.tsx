import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Tooltip } from '@mui/material';
import { useStudentContext } from '../../contexts/StudentContext';
import { useEvaluationContext } from '../../contexts/EvaluationContext';
import { countCriterionsInDossier } from '../../utils/dossierUtils';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../contexts/SnackBarContext';

type StudentScore = {
  student: Student
  score: number
}

interface StudentsScoresProps {
  setCanExport: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StudentsScores({ setCanExport }: StudentsScoresProps) {
  const { students, selectedStudentIndex, setSelectedStudentIndex } = useStudentContext();
  const { evaluations, dossierTemplate, hasEvaluationUpdated } = useEvaluationContext();
  const [studentsScores, setStudentsScores] = useState<StudentScore[]>([]);
  const { showMessage } = useSnackbar();

  useEffect(() => {
    setStudentsScores(students.map(student => ({
      student,
      score: calculateProgress(student.id),
    })));
  }, [evaluations]);

  useEffect(() => {
    const sum = studentsScores.reduce((sum, current) => sum + current.score, 0);
    setCanExport(sum / 100 === students.length);
  }, [studentsScores]);

  const calculateProgress = (studentId: number) => {
    const ev = evaluations.find(ev => ev.studentId === studentId)?.evaluation;
    const total = dossierTemplate ? countCriterionsInDossier(dossierTemplate) : 0;
    return ev && total ? Math.round((ev.length * 100) / total) : 0;
  };

  const handleSelectedStudent = (i: number) => {
    if (!hasEvaluationUpdated) setSelectedStudentIndex(i);
    else showMessage("Por favor, salve as alterações antes de trocar de estudante.", "error");
  };

  const studentGrade = (studentId: number) =>
    evaluations.find(ev => ev.studentId === studentId)?.grade ?? "-";

  const CellText = ({ children }: { children: React.ReactNode }) => (
    <Typography fontWeight={500} fontSize="1rem" color="#263238">
      {children}
    </Typography>
  );

  const headers = ["Concluído", "Aluno", "Matrícula", "Nota"];

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>
                <Typography fontWeight={500} color="#455A64">{header}</Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {studentsScores.map(({ student, score }, i) => (
            <TableRow
              key={student.id}
              onClick={() => handleSelectedStudent(i)}
              sx={{
                backgroundColor: selectedStudentIndex === i ? "#c4c4c4" : "white",
                transition: "ease-in-out .1s",
                "&:hover": { backgroundColor: "#c4c4c4" },
              }}
            >
              <TableCell><CellText>{score}%</CellText></TableCell>
              <TableCell>
                <Tooltip title={student.name} arrow>
                  <span><CellText>{student.name.split(" ")[0]}</CellText></span>
                </Tooltip>
              </TableCell>
              <TableCell><CellText>{student.registration}</CellText></TableCell>
              <TableCell><CellText>{studentGrade(student.id)}</CellText></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

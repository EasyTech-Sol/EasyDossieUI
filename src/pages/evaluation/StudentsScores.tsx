import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Tooltip, Snackbar } from '@mui/material';
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

  const { students, selectedStudentIndex, setSelectedStudentIndex } = useStudentContext()
  const { evaluations, dossierTemplate, hasEvaluationUpdated } = useEvaluationContext()
  const [studentsScores, setStudentsScores] = useState<StudentScore[]>([])
  const { showMessage } = useSnackbar()

  const calculateProgress = (studentId: number) => {
    if (dossierTemplate && evaluations) { // Garante que evaluations também existe
      // 1. Encontra a entrada de avaliação para o aluno específico
      const studentEvaluationEntry = evaluations.find(ev => ev.studentId === studentId);
      if (studentEvaluationEntry && studentEvaluationEntry.evaluation) {
        // 2. Conta quantos critérios foram efetivamente avaliados para este aluno
        const numberOfAnsweredCriterions = studentEvaluationEntry.evaluation.length;
        // 3. Conta o total de critérios no dossiê
        const totalNumberOfCriterions = countCriterionsInDossier(dossierTemplate);
        // 4. Calcula a porcentagem
        if (totalNumberOfCriterions > 0) {
          // Arredonda para não ter muitas casas decimais
          return Math.round((numberOfAnsweredCriterions * 100) / totalNumberOfCriterions);
        }
      }
    }
    return 0; // Retorna 0 se não houver template, avaliações ou se o aluno não tiver avaliações
  };

  useEffect(() => {
    setStudentsScores(students.map(student => ({ student, score: calculateProgress(student.id) })))
  }, [evaluations])

  useEffect(() => {
    const sum = studentsScores.reduce((sum, current) => sum + current.score, 0);
    const canExport = sum / 100 === students.length
    setCanExport(canExport)
  }, [studentsScores])

  const handleSelectedStudent = (i: number) => {
    if (!hasEvaluationUpdated)
      setSelectedStudentIndex(i)
    else
      showMessage("Por favor, salve as alterações antes de trocar de estudante.",
    "error")
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography fontWeight={500} color="#455A64">Concluído</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={500} color="#455A64">Aluno</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={500} color="#455A64">Matrícula</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentsScores.map(({ student, score }, i) => (
            <TableRow key={student.name} sx={{
              backgroundColor: selectedStudentIndex === i ? "#c4c4c4" : "white",
              transition: "ease-in-out .1s",
              "&:hover": {
                backgroundColor: "#c4c4c4", // tom levemente mais escuro
              },
            }}>
              <TableCell onClick={() => handleSelectedStudent(i)}>
                <Typography fontWeight={500} fontSize="1rem" color="#263238">
                  {score}%
                </Typography>
              </TableCell>
              <TableCell onClick={() => handleSelectedStudent(i)}>
                <Tooltip title={student.name} arrow>
                  <Typography fontWeight={500} fontSize="1rem" color="#263238">
                    {student.name.split(" ")[0]}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell onClick={() => handleSelectedStudent(i)}>
                <Tooltip title={student.name} arrow>
                  <Typography fontWeight={500} fontSize="1rem" color="#263238">
                    {student.registration}
                  </Typography>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Tooltip } from '@mui/material';
import { useStudentContext } from '../../contexts/StudentContext';
import { useEvaluationContext } from '../../contexts/EvaluationContext';
import { countCriterionsInDossier } from '../../utils/dossierUtils';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../contexts/SnackBarContext';
import { apiService } from '../../services/easydossie.service';
import { useParams } from 'react-router-dom';

type StudentScore = {
  student: Student
  score: number
  finalGrade: number | null
}

interface StudentsScoresProps {
  setCanExport: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StudentsScores({ setCanExport }: StudentsScoresProps) {
  const { students, selectedStudentIndex, setSelectedStudentIndex } = useStudentContext()
  const { evaluations, dossierTemplate, hasEvaluationUpdated, setEvaluations } = useEvaluationContext()
  const [studentsScores, setStudentsScores] = useState<StudentScore[]>([])
  const { showMessage } = useSnackbar()
  const { classId, dossierId } = useParams()

  const reloadEvaluations = async () => {
    try {
      const result = await apiService.getClassDossierEvaluation(classId!, dossierId!);
      const backendResponseData = result.data;
      const studentDossiers = backendResponseData.dossiersStudent;
      console.log('Dados retornados pela API:', studentDossiers);
      setEvaluations(studentDossiers);
    } catch (error) {
      console.error("Erro ao recarregar avaliações:", error);
      showMessage("Erro ao recarregar avaliações", "error");
    }
  };

  useEffect(() => {
    reloadEvaluations();
  }, []);

  const calculateProgress = (studentId: number) => {
    if (dossierTemplate && evaluations) {
      const studentEvaluationEntry = evaluations.find(ev => ev.studentId === studentId);
      if (studentEvaluationEntry && studentEvaluationEntry.evaluation) {
        const numberOfAnsweredCriterions = studentEvaluationEntry.evaluation.length;
        const totalNumberOfCriterions = countCriterionsInDossier(dossierTemplate);
        if (totalNumberOfCriterions > 0) {
          return Math.round((numberOfAnsweredCriterions * 100) / totalNumberOfCriterions);
        }
      }
    }
    return 0;
  };

  const getFinalGrade = (studentId: number): number | null => {
    if (!evaluations) return null;
    const studentEvaluation = evaluations.find(ev => ev.studentId === studentId);
    return studentEvaluation?.grade ?? null;
  };

  useEffect(() => {
    setStudentsScores(students.map(student => ({
      student,
      score: calculateProgress(student.id),
      finalGrade: getFinalGrade(student.id)
    })));
  }, [evaluations]);

  useEffect(() => {
    const sum = studentsScores.reduce((sum, current) => sum + current.score, 0);
    const canExport = sum / 100 === students.length;
    setCanExport(canExport);
  }, [studentsScores]);

  const handleSelectedStudent = (i: number) => {
    if (!hasEvaluationUpdated)
      setSelectedStudentIndex(i);
    else
      showMessage("Por favor, salve as alterações antes de trocar de estudante.", "error");
  };

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
            <TableCell>
              <Typography fontWeight={500} color="#455A64">Nota Final</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {studentsScores.map(({ student, score, finalGrade }, i) => (
            <TableRow key={student.name} sx={{
              backgroundColor: selectedStudentIndex === i ? "#c4c4c4" : "white",
              transition: "ease-in-out .1s",
              "&:hover": {
                backgroundColor: "#c4c4c4",
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
              <TableCell onClick={() => handleSelectedStudent(i)}>
                <Typography 
                  fontWeight={500} 
                  fontSize="1rem" 
                  color={finalGrade === null ? '#263238' :
                         finalGrade >= 9.0 ? '#4CAF50' : 
                         finalGrade >= 7.0 ? '#8BC34A' :
                         finalGrade >= 5.0 ? '#FFC107' :
                         finalGrade >= 3.0 ? '#FF9800' :
                         '#F44336'}
                >
                  {finalGrade === null ? '-' : finalGrade.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

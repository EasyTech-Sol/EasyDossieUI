import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Tooltip } from '@mui/material';
import { useStudentContext } from '../../contexts/StudentContext';
import { useEvaluationContext } from '../../contexts/EvaluationContext';
import { countCriterionsInDossier } from '../../utils/dossierUtils';

export default function StudentsScores() {

  const { students, selectedStudentIndex, setSelectedStudentIndex } = useStudentContext()
  const { evaluations, dossierTemplate } = useEvaluationContext()

  const calculateProgress = (studentId: number) => {
    if (dossierTemplate) {
      const numberOfStudentCriterions = evaluations.filter(ev => ev.studentId === studentId).length
      const numberOfCriterions = countCriterionsInDossier(dossierTemplate)

      return numberOfStudentCriterions ? numberOfStudentCriterions * 100 / numberOfCriterions : 0
    }
    return 0
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
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student, i) => (
            <TableRow key={student.name} sx={{
              backgroundColor: selectedStudentIndex === i ? "#c4c4c4" : "white",
              transition: "ease-in-out .1s",
              "&:hover": {
                backgroundColor: "#c4c4c4", // tom levemente mais escuro
              },
            }}>
              <TableCell onClick={() => setSelectedStudentIndex(i)}>
                <Typography fontWeight={500} fontSize="1rem" color="#263238">
                  {calculateProgress(student.id)}%
                </Typography>
              </TableCell>
              <TableCell onClick={() => setSelectedStudentIndex(i)}>
                <Tooltip title={student.name} arrow>
                  <Typography fontWeight={500} fontSize="1rem" color="#263238">
                    {student.name.split(" ")[0]}
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

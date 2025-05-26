import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Tooltip } from '@mui/material';

const students = [
  { name: 'JOÃO SILVA', progress: 100 },
  { name: 'PEDRO', progress: 100 },
  { name: 'JONAS', progress: 100 },
  { name: 'AMANDA', progress: 100 },
  { name: 'VERA', progress: 0 },
  { name: 'LUCAS', progress: 0 },
  { name: 'RAFAEL', progress: 0 },
  { name: 'SOLANGE', progress: 0 },
];

export default function CompletionTable() {
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
          {students.map((student) => (
            <TableRow key={student.name}>
              <TableCell>
                <Typography fontWeight={500} fontSize="1rem" color="#263238">
                  {student.progress}%
                </Typography>
              </TableCell>
              <TableCell>
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

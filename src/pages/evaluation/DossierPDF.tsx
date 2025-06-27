import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';

interface DossiePDFProps {
  dossier: Dossier;
  student: Student;
  evaluation: Evaluation;
}

const DossierPDF: React.FC<DossiePDFProps> = ({ dossier, student, evaluation }) => {
  const concepts = dossier.concepts.split(',');

  return (
    <Paper
      elevation={0}
      sx={{
        p: 5,
        border: '1px solid #eee',
        pageBreakAfter: 'always',
      }}
    >
      <Typography variant="h4" textAlign="center" color="success" gutterBottom>
        Dossiê Avaliativo
      </Typography>

      <Divider sx={{ my: 1, borderColor: 'success' }} />

      <Typography variant="h5">{student.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Matrícula: {student.registration}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Nota Final: {evaluation.grade ? evaluation.grade.toFixed(2) : '-'}
      </Typography>

      <Box mt={2}>
        <Typography variant="h6" gutterBottom>
          {dossier.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Área: {dossier.evaluationArea}
        </Typography>
        <Typography variant="body1" paragraph>
          {dossier.description}
        </Typography>
      </Box>

      {dossier.categories.map(category => (
        <Box key={category.id} sx={{ mt: 3 }}>
          <Typography variant="h6" textAlign="center">
            {category.title} — {category.weight}%
          </Typography>

          <Divider sx={{ my: 1, borderColor: 'success' }} />

          {category.descriptions.map(description => (
            <Box key={description.id} mt={2}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={1}
                borderColor="divider"
                pb={0.5}
              >
                <Typography variant="subtitle1">
                  {description.title}
                </Typography>
                <Box display="flex" gap={1}>
                  {concepts.map(letter => (
                    <Typography
                      key={letter}
                      variant="body2"
                      color="white"
                      sx={{
                        border: '1px solid #4CAF50',
                        px: 1,
                        borderRadius: 1,
                        backgroundColor: '#4CAF50',
                      }}
                    >
                      {letter}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Box sx={{ pl: 2 }}>
                {description.criteria.map((criterion) => {
                  const evaluationItem = evaluation.evaluation?.find(
                    e => e.criterionId === criterion.id
                  );
                  return (
                    <Box
                      key={criterion.id}
                      display="flex"
                      alignItems="center"
                      py={0.5}
                      borderBottom="1px solid #eee"
                    >
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {criterion.title}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {evaluationItem?.concept || '-'}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      ))}
    </Paper>
  );
};

export default DossierPDF;

import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';
import { Dossier } from '../types/dossier.d';
import { Student } from '../types/student.d';
import { Evaluation } from '../types/evaluation.d';

interface DossiePDFProps {
  dossier: Dossier;
  student: Student;
  evaluation: Evaluation;
}

const DossiePDF: React.FC<DossiePDFProps> = ({ dossier, student, evaluation }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid #eee',
        pageBreakAfter: 'always',
      }}
    >
      <Typography variant="h4" gutterBottom component="h2" color="primary">
        Dossiê Acadêmico
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="h5">{student.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Matrícula: {student.registration}
      </Typography>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          {dossier.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Área: {dossier.evaluationArea}
        </Typography>
        <Typography variant="body1" paragraph>
          {dossier.description}
        </Typography>
      </Box>

      {dossier.categories.map(category => (
        <Box key={category.id} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {category.title}
          </Typography>
          {category.descriptions.map(description => (
            <Box key={description.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {description.title}
              </Typography>
              {description.criteria.map(criterion => {
                const evaluationItem = evaluation.evaluation.find(
                  e => e.criterionId === criterion.id
                );
                return (
                  <Box key={criterion.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{criterion.title}</Typography>
                    <Typography fontWeight="bold">
                      {evaluationItem?.concept || '-'}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      ))}
    </Paper>
  );
};

export default DossiePDF; 
import React from 'react';
import { Paper, Typography, Box, Divider } from '@mui/material';

interface DossiePDFProps {
  dossier: Dossier;
  student: Student;
  evaluation: Evaluation;
}

const DossierPDF: React.FC<DossiePDFProps> = ({ dossier, student, evaluation }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid #eee',
        pageBreakAfter: 'always',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        color="success"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        Dossiê Acadêmico
      </Typography>

      <Divider sx={{ my: 2, borderColor: 'success' }} />

      <Typography
        variant="h5"
        sx={{
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {student.name}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary">
        Matrícula: {student.registration}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Nota Final: {evaluation.grade ? evaluation.grade.toFixed(2) : '-'}
      </Typography>

      <Box mt={3}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {dossier.title}
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          Área: {dossier.evaluationArea}
        </Typography>

        <Typography
          variant="body1"
          paragraph
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {dossier.description}
        </Typography>
      </Box>

      {dossier.categories.map(category => (
        <Box key={category.id} sx={{ mt: 5 }}>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {category.title} — {category.weight}%
          </Typography>

          <Divider sx={{ my: 2, borderColor: 'success' }} />

          {category.descriptions.map(description => (
            <Box key={description.id} mt={3}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              >
                {description.title}
              </Typography>

              <Box sx={{ pl: 3 }}>
                {description.criteria.map((criterion) => {
                  const evaluationItem = evaluation.evaluation?.find(
                    e => e.criterionId === criterion.id
                  );
                  return (
                    <Box
                      key={criterion.id}
                      display="flex"
                      alignItems="center"
                      py={1}
                      borderBottom="1px solid #eee"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          flex: 1,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                        }}
                      >
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

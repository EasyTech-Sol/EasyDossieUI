import React from 'react';
import { Box, Typography, Paper, Dialog, DialogContent, Divider } from '@mui/material';

interface DossierViewProps {
  dossier: Dossier
  open: boolean
  onClose: () => void
}

const textWrapStyle = {
  whiteSpace: 'pre-wrap',         
  wordWrap: 'break-word',        
  overflowWrap: 'break-word',     
};

const DescriptionView: React.FC<{ description: Description, concepts: string[] }> = ({ description, concepts }) => (
  <Box mt={3}>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom={1}
      borderColor="divider"
      pb={1}
      sx={{ ...textWrapStyle }} // Força quebra na linha do título + conceitos
    >
      <Typography variant="subtitle1" sx={{ ...textWrapStyle }}>
        {description.title}
      </Typography>

      <Box display="flex" gap={1} sx={{ flexWrap: 'wrap' }}> {/* Conceitos também quebram se precisarem */}
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
              ...textWrapStyle,
            }}
          >
            {letter}
          </Typography>
        ))}
      </Box>
    </Box>

    <Box sx={{ pl: 3 }}>
      {description.criteria.map((criterion, index) => (
        <Box
          key={criterion.id}
          display="flex"
          alignItems="flex-start"
          py={1}
          borderBottom="1px solid #eee"
          sx={{ ...textWrapStyle }}
        >
          <Typography variant="body2" sx={{ width: 20 }}>
            {String(index + 1).padStart(2, '0')}
          </Typography>
          <Typography variant="body2" sx={{ ...textWrapStyle }}>
            {criterion.title}
          </Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

const CategoryView: React.FC<{ category: Category, concepts: string[] }> = ({ category, concepts }) => (
  <Paper elevation={3} sx={{ p: 2, mt: 4, ...textWrapStyle }}>
    <Typography variant="h6" textAlign="center" sx={{ ...textWrapStyle }}>
      {category.title} — {category.weight}%
    </Typography>
    <Divider sx={{ my: 2 }} />
    {category.descriptions.map(description => (
      <DescriptionView key={description.id} description={description} concepts={concepts} />
    ))}
  </Paper>
);

const DossierView = ({ dossier, open, onClose }: DossierViewProps) => {
  const concepts = dossier.concepts.split(',');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent sx={{ ...textWrapStyle }}>
        <Typography variant="h4" gutterBottom textAlign="center" sx={{ ...textWrapStyle }}>
          {dossier.title}
        </Typography>
        <Typography variant="h5" textAlign="center" sx={{ ...textWrapStyle }}>
          Área: {dossier.evaluationArea}
        </Typography>

        {dossier.categories.map(category => (
          <CategoryView key={category.id} category={category} concepts={concepts} />
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default DossierView;

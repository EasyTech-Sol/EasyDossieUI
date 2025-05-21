import React from 'react';
import { Box, Typography, Paper, Dialog, DialogContent, Divider} from '@mui/material';

const DescriptionView: React.FC<{ description: Description, concepts: string[] }> = ({ description, concepts }) => (
<Box mt={3}>
  <Box 
    display="flex" 
    justifyContent="space-between" 
    alignItems="center"
    borderBottom={1}
    borderColor="divider"
    pb={1}
    
  >
    <Typography variant="subtitle1">{description.title}</Typography>

    <Box display="flex" gap={1}>
      {concepts.map(letter => (
        <Typography 
          key={letter} 
          variant="body2"
          color= 'white'
          sx={{ border: '1px solid #4CAF50', px: 1, borderRadius: 1, backgroundColor: '#4CAF50', 
        }}
          >
          {letter}
        </Typography>
      ))}
    </Box>
  </Box>

<Box  sx={{ pl: 3 }}>
  {description.criteria.map((criterion, index) => (
    <Box 
      key={criterion.id} 
      display="flex" 
      alignItems="center" 
      py={1} 
      borderBottom="1px solid #eee"
    >
      <Typography variant="body2" sx={{ width: 20 }}>
        {String(index + 1).padStart(2, '0')}
      </Typography>
      <Typography variant="body2">{criterion.titulo}</Typography>
    </Box>
  ))}
</Box>
</Box>
);

const CategoryView: React.FC<{ category: Category, concepts: string[] }> = ({ category, concepts }) => (
    <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" textAlign="center">
        {category.title} — {category.weight * 10}%
      </Typography>
      <Divider sx={{ my: 2 }} />
      {category.descriptions.map(description => (
        <DescriptionView key={description.id} description={description} concepts={concepts} />
      ))}
    </Paper>
  );
  
  const DossierView: React.FC<{ dossier: Dossier }> = ({ dossier }) => {
    const concepts = dossier.concept.split(','); 
  
    return (
      <Dialog open fullWidth maxWidth="md">
        <DialogContent>
          <Typography variant="h4" gutterBottom textAlign="center">{dossier.title}</Typography>
          <Typography variant="h5" textAlign="center">Área: {dossier.evaluation_area}</Typography>
  
          {dossier.categories.map(category => (
            <CategoryView key={category.id} category={category} concepts={concepts} />
          ))}
        </DialogContent>
      </Dialog>
    );
  };
  
export default DossierView;

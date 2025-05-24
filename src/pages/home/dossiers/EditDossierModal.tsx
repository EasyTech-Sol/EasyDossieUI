import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  FormHelperText,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { apiService } from '../../../services/easydossie.service';
import CustomLabelSlider from './CustomLabelSlider';

interface EditDossieModalProps {
  open: boolean;
  onClose: () => void;
  dossierData: Dossier;
  onSave: (updatedDossie: Dossier) => void;
}

export default function EditDossieModal({
  open,
  onClose,
  dossierData,
  onSave,
}: EditDossieModalProps) {
  const [dossier, setDossier] = useState<Dossier>(dossierData);
  const [conceitosError, setConceitosError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDossier(dossierData);
    setConceitosError(null);
  }, [dossierData]);

  const handleChange = (field: keyof Dossier, value: any) => {
    setDossier({ ...dossier, [field]: value });
  };

  const handleCategoryChange = (ci: number, field: keyof Category, val: any) => {
    const cats = [...dossier.categories];
    cats[ci] = { ...cats[ci], [field]: val };
    setDossier({ ...dossier, categories: cats });
  };

  const handleDescriptionChange = (ci: number, di: number, val: string) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].title = val;
    setDossier({ ...dossier, categories: cats });
  };

  const handleCriterionChange = (ci: number, di: number, qi: number, val: string) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].criteria[qi].title = val;
    setDossier({ ...dossier, categories: cats });
  };

  const addCategory = () => {
    const newCategory: Category = {
      id: 0, title: '', weight: 1, descriptions: [],
      dossierTemplateId: ''
    }
    setDossier({
      ...dossier,
      categories: [...dossier.categories ?? [], newCategory],
    });
  };

  const addDescription = (ci: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions.push({ id: 0, title: '', criteria: [] });
    setDossier({ ...dossier, categories: cats });
  };

  const addCriterion = (ci: number, di: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].criteria.push({ id: 0, title: '' });
    setDossier({ ...dossier, categories: cats });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiService.editDossier(dossier);
      onSave(dossier);
      onClose();
    } catch (err: any) {
      alert('Erro ao salvar: ' + (err.response?.data?.erro || err.message));
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Dossiê</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Título"
          value={dossier.title}
          onChange={(e) => handleChange('title', e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Descrição"
          value={dossier.description}
          onChange={(e) => handleChange('description', e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Área de Avaliação"
          value={dossier.evaluationArea}
          onChange={(e) => handleChange('evaluationArea', e.target.value)}
          margin="normal"
        />

        <Box display="flex" alignItems="center" gap={2} mt={2} flexWrap="wrap">
          <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
            Conceitos:
          </Typography>
          <CustomLabelSlider setOutput={
            (concepts: Concept) => setDossier(prev => ({ ...prev, concepts: concepts }))}
            initialValue={dossier.concepts} />
        </Box>
        {conceitosError && (
          <FormHelperText error sx={{ mt: 1 }}>
            {conceitosError}
          </FormHelperText>
        )}

        <Typography variant="h6" mt={2}>
          Categorias de Avaliação
        </Typography>

        {dossier.categories?.map((cat, ci) => (
          <Accordion key={ci} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{cat.title || `Categoria ${ci + 1}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Título da Categoria"
                value={cat.title}
                onChange={(e) => handleCategoryChange(ci, 'title', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Peso"
                type="number"
                value={cat.weight}
                onChange={(e) =>
                  handleCategoryChange(ci, 'weight', parseFloat(e.target.value) || 0)
                }
                margin="normal"
              />

              <Typography variant="subtitle1" mt={2}>
                Descrições
              </Typography>
              {cat.descriptions.map((desc: any, di: any) => (
                <Box key={di} mb={2} pl={2} borderLeft="2px solid #ccc">
                  <TextField
                    fullWidth
                    label={`Título da Descrição ${di + 1}`}
                    value={desc.title}
                    onChange={(e) => handleDescriptionChange(ci, di, e.target.value)}
                    margin="normal"
                  />
                  {desc.criteria.map((q: any, qi: any) => (
                    <TextField
                      key={qi}
                      fullWidth
                      label={`Quesito ${qi + 1}`}
                      value={q.title}
                      onChange={(e) => handleCriterionChange(ci, di, qi, e.target.value)}
                      margin="normal"
                    />
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addCriterion(ci, di)}
                    sx={{ mt: 1 }}
                  >
                    Adicionar Quesito
                  </Button>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addDescription(ci)}
                sx={{ mt: 1 }}
              >
                Adicionar Descrição
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addCategory}
            variant="contained"
            sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
          >
            Adicionar Categoria
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Modelo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

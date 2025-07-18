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
import DeleteIcon from '@mui/icons-material/Delete';
import { apiService } from '../../../services/easydossie.service';
import CustomLabelSlider from './CustomLabelSlider';
import { useSnackbar } from '../../../contexts/SnackBarContext';

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
  const { showMessage } = useSnackbar();

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
    };
    setDossier({
      ...dossier,
      categories: [...dossier.categories ?? [], newCategory],
    });
  };

  const addDescription = (ci: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions.push({
      id: 0, title: '', criteria: [],
      categoryId: ''
    });
    setDossier({ ...dossier, categories: cats });
  };

  const removeCategory = (ci: number) => {
    const cats = [...dossier.categories];
    cats.splice(ci, 1);
    setDossier({ ...dossier, categories: cats });
  };

  const removeDescription = (ci: number, di: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions.splice(di, 1);
    setDossier({ ...dossier, categories: cats });
  };

  const removeCriterion = (ci: number, di: number, qi: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].criteria.splice(qi, 1);
    setDossier({ ...dossier, categories: cats });
  };

  const addCriterion = (ci: number, di: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].criteria.push({
      id: 0, title: '',
      descriptionId: ''
    });
    setDossier({ ...dossier, categories: cats });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const resp = await apiService.editDossier(dossier);
      showMessage(
        resp.data?.message || 'Dossiê salvo com sucesso!',
        resp.data?.type || 'success'
      );
      onSave(resp.data.data);
      onClose();
    } catch (err: any) {
      console.error(err);
      showMessage(
        err.response?.data?.error || 'Erro ao salvar o dossiê.',
        err.response?.data?.type || 'error'
      );
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
          <CustomLabelSlider
            setOutput={(concepts: string) =>
              setDossier(prev => ({ ...prev, concepts }))
            }
          />
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
                label="Peso (Soma dos pesos do dossiê devem resultar em 100)"
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
              {cat.descriptions.map((desc, di) => (
                <Box key={di} mb={2} pl={2} borderLeft="2px solid #ccc">
                  <TextField
                    fullWidth
                    label={`Título da Descrição ${di + 1}`}
                    value={desc.title}
                    onChange={(e) => handleDescriptionChange(ci, di, e.target.value)}
                    margin="normal"
                  />
                  {desc.criteria.map((q: any, qi: any) => (
                    <Box key={qi} display="flex" alignItems="center" gap={1}>
                      <TextField
                        fullWidth
                        label={`Quesito ${qi + 1}`}
                        value={q.title}
                        onChange={(e) => handleCriterionChange(ci, di, qi, e.target.value)}
                        margin="normal"
                      />
                      <Button
                        color='error'
                        onClick={() => removeCriterion(ci, di, qi)}
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                  ))}
                  <Box display="flex" gap={1} mt={1}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => addCriterion(ci, di)}
                      color='success'
                    >
                      Adicionar Quesito
                    </Button>
                    <Button
                      variant="outlined"
                      color='error'
                      startIcon={<DeleteIcon />}
                      onClick={() => removeDescription(ci, di)}
                    >
                      Remover Descrição
                    </Button>
                  </Box>
                </Box>
              ))}
              <Box display="flex" gap={1} mt={2}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => addDescription(ci)}
                  color='success'
                >
                  Adicionar Descrição
                </Button>
                <Button
                  variant="outlined"
                  color='error'
                  startIcon={<DeleteIcon />}
                  onClick={() => removeCategory(ci)}
                >
                  Remover Categoria
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}

        <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addCategory}
            variant="contained"
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': { backgroundColor: '#388e3c' },
            }}
          >
            Adicionar Categoria
          </Button>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="success">
          Cancelar
        </Button>
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

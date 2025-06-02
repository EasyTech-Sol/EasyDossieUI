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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import CustomLabelSlider from './CustomLabelSlider';
import { useSnackbar } from '../../../contexts/SnackBarContext';

interface CreateDossieProps {
  open: boolean;
  onClose: () => void;
  dossieData: Dossier;
  onSave: ({ templateData }: DossierInput) => Promise<boolean>;
}


export default function CreateDossie({ open, onClose, dossieData, onSave }: CreateDossieProps) {
  const [loading, setLoading] = useState(false);
  const { showMessage } = useSnackbar(); 

  const [dossier, setDossier] = useState<Dossier>(() => ({
    ...dossieData,
    concepts: dossieData.concepts ?? [],
  }));


  if (!dossier) return null;

  const handleChange = (field: keyof Dossier, value: any) => {
    setDossier({ ...dossier, [field]: value });
  };

  const handleCategoriaChange = (ci: number, field: keyof Category, val: any) => {
    const cats = [...dossier.categories];
    cats[ci] = { ...cats[ci], [field]: val };
    setDossier({ ...dossier, categories: cats });
  };

  const handleDescricaoChange = (ci: number, di: number, val: string) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].title = val;
    setDossier({ ...dossier, categories: cats });
  };

  const handleQuesitoChange = (ci: number, di: number, qi: number, val: string) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].criteria[qi].title = val;
    setDossier({ ...dossier, categories: cats });
  };

  const addCategoria = () => {
    setDossier({
      ...dossier,
      categories: [...dossier.categories, {
        id: 0, title: '', weight: 1, descriptions: [],
        dossierTemplateId: ''
      }],
    });
  };

  const addDescricao = (ci: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions.push({ id: 0, title: '', criteria: [] });
    setDossier({ ...dossier, categories: cats });
  };

  const addQuesito = (ci: number, di: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].criteria.push({ id: 0, title: '' });
    setDossier({ ...dossier, categories: cats });
  };

  const handleSave = async () => {
  setLoading(true);
  try {
    const success = await onSave({ templateData: dossier });
    if (success) {
      showMessage('Dossiê salvo com sucesso!', 'success');
      onClose();  // <<< Fecha só se salvou
    }
    // Se falhou, só exibe o snackbar, mas NÃO fecha.
  } catch (err: any) {
    showMessage('Erro inesperado ao salvar.', 'error');
    // Não fecha o modal.
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Cadastrar Dossiê</DialogTitle>
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

        <Box display="flex" flexDirection={"row"} alignItems="center" gap={2} mt={2} flexWrap="wrap">
          <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
            Conceitos:
          </Typography>
          <CustomLabelSlider setOutput={
            (concepts: string) => setDossier(prev => ({...prev, concepts: concepts}))}/>
        </Box>

        <Typography variant="h6" mt={2}>
          Categorias de Avaliação
        </Typography>

        {dossier.categories.map((cat, ci) => (
          <Accordion key={ci} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{cat.title || `Categoria ${ci + 1}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Título da Categoria"
                value={cat.title}
                onChange={(e) => handleCategoriaChange(ci, 'title', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Peso"
                type="number"
                value={cat.weight}
                onChange={(e) =>
                  handleCategoriaChange(ci, 'weight', parseFloat(e.target.value) || 0)
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
                    onChange={(e) => handleDescricaoChange(ci, di, e.target.value)}
                    margin="normal"
                  />
                  {desc.criteria.map((q: any, qi: any) => (
                    <TextField
                      key={qi}
                      fullWidth
                      label={`Quesito ${qi + 1}`}
                      value={q.title}
                      onChange={(e) => handleQuesitoChange(ci, di, qi, e.target.value)}
                      margin="normal"
                    />
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => addQuesito(ci, di)}
                    sx={{ mt: 1 }}
                  >
                    Adicionar Quesito
                  </Button>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addDescricao(ci)}
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
            onClick={addCategoria}
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
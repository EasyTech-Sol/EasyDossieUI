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
    console.log(dossier)
  }, [dossierData]);

  const handleChange = (field: keyof Dossier, value: any) => {
    setDossier({ ...dossier, [field]: value });
  };

  const handleCategoriaChange = (ci: number, field: keyof Category, val: any) => {
    const cats = [...dossier.categories];
    cats[ci] = { ...cats[ci], [field]: val };
    setDossier({ ...dossier, categories: cats });
  };

  const handleDescricaoChange = (ci: number, di: number, val: string) => {
    console.log("descrição", dossier)
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].title = val;
    setDossier({ ...dossier, categories: cats });
  };

  const handleQuesitoChange = (ci: number, di: number, qi: number, val: string) => {
    console.log("quesito", dossier)
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].quesitos[qi].title = val;
    setDossier({ ...dossier, categories: cats });
  };

  const addCategoria = () => {
    const newCategory: Category = {
      id: 0, title: '', weight: 1, descriptions: [],
      dossierTemplateId: ''
    }
    setDossier({
      ...dossier,
      categories: [...dossier.categories ?? [], newCategory],
    });
  };

  const addDescricao = (ci: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions.push({ id: 0, title: '', quesitos: [] });
    setDossier({ ...dossier, categories: cats });
  };

  const addQuesito = (ci: number, di: number) => {
    const cats = [...dossier.categories];
    cats[ci].descriptions[di].quesitos.push({ id: 0, title: '' });
    setDossier({ ...dossier, categories: cats });
  };

  const handleSave = async () => {
    setLoading(true);
    // 2) categoryIDs
    const categoryIDs = dossier.categories?.reduce<Record<number, [string, number]>>(
      (acc, cat) => {
        if (cat.id) acc[cat.id] = [cat.title, cat.weight];
        return acc;
      },
      {}
    );

    // 3) descriptionIDs
    const descriptionIDs = dossier.categories?.flatMap((cat) =>
        cat.descriptions.map((desc: any) => ({ id: desc.id, tuple: [desc.title, cat.id] as [string, number] }))
      )
      .reduce<Record<number, [string, number]>>((acc, { id, tuple }) => {
        if (id) acc[id] = tuple;
        return acc;
      }, {});

    // 4) questionsIDs
    const questionsIDs = dossier.categories?.flatMap((cat) =>
        cat.descriptions.flatMap((desc: any) =>
          desc.quesitos.map((q: any) => ({
            id: q.id,
            tuple: [q.title, desc.id, cat.id] as [string, number, number],
          }))
        )
      )
      .reduce<Record<number, [string, number, number]>>((acc, { id, tuple }) => {
        if (id) acc[id] = tuple;
        return acc;
      }, {});

    try {
      const resp = await apiService.editDossier(dossier,
        questionsIDs,
        categoryIDs,
        descriptionIDs,
      );
      onSave(resp.data.data);
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
          value={dossier.evaluation_area}
          onChange={(e) => handleChange('evaluation_area', e.target.value)}
          margin="normal"
        />

        <Box display="flex" alignItems="center" gap={2} mt={2} flexWrap="wrap">
          <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
            Conceitos:
          </Typography>
          <CustomLabelSlider setOutput={
            (concepts: string) => setDossier(prev => ({ ...prev, concept: concepts }))} />
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
                  {desc.quesitos.map((q: any, qi: any) => (
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

import React, { useEffect, useState } from 'react';
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

interface CreateDossieProps {
  open: boolean;
  onClose: () => void;
  dossieData: Dossie;
  onSave: ({ templateData, categories }: DossierInput) => void;
}


export default function CreateDossie({ open, onClose, dossieData, onSave }: CreateDossieProps) {
  const [dossie, setDossie] = useState<Dossie>({
    ...dossieData,
    concepts: dossieData.concepts ?? [],
  });
  const [conceitosError, setConceitosError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDossie({
      ...dossieData,
      concepts: dossieData.concepts ?? [],
    });
    setConceitosError(null);
  }, [dossieData]);

  if (!dossie) return null;

  const handleChange = (field: keyof Dossie, value: any) => {
    setDossie({ ...dossie, [field]: value });
  };

  const handleCategoriaChange = (ci: number, field: keyof Categoria, val: any) => {
    const cats = [...dossie.categories];
    cats[ci] = { ...cats[ci], [field]: val };
    setDossie({ ...dossie, categories: cats });
  };

  const handleDescricaoChange = (ci: number, di: number, val: string) => {
    const cats = [...dossie.categories];
    cats[ci].descricoes[di].title = val;
    setDossie({ ...dossie, categories: cats });
  };

  const handleQuesitoChange = (ci: number, di: number, qi: number, val: string) => {
    const cats = [...dossie.categories];
    cats[ci].descricoes[di].quesitos[qi].titulo = val;
    setDossie({ ...dossie, categories: cats });
  };

  const addCategoria = () => {
    setDossie({
      ...dossie,
      categories: [...dossie.categories, { id: 0, title: '', weight: 1, descricoes: [] }],
    });
  };

  const addDescricao = (ci: number) => {
    const cats = [...dossie.categories];
    cats[ci].descricoes.push({ id: 0, title: '', quesitos: [] });
    setDossie({ ...dossie, categories: cats });
  };

  const addQuesito = (ci: number, di: number) => {
    const cats = [...dossie.categories];
    cats[ci].descricoes[di].quesitos.push({ id: 0, titulo: '' });
    setDossie({ ...dossie, categories: cats });
  };

  const validarConceitos = (c: string[]) => c.length >= 3;


  const handleSave = async () => {
    if (!validarConceitos(dossie.concepts)) {
      setConceitosError('Selecione pelo menos 3 concepts (A, B, C, D, E).');
      return;
    }
    setConceitosError(null);
    setLoading(true);

    try {
      const conceptsString = dossie.concepts.join(', ');
      const { categories, ...templateData } = dossie
      onSave({ templateData: { ...templateData, concept: conceptsString }, categories });
      onClose();
    } catch (err: any) {
      alert('Erro ao salvar: ' + (err.response?.data?.erro || err.message));
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
          value={dossie.title}
          onChange={(e) => handleChange('title', e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Descrição"
          value={dossie.description}
          onChange={(e) => handleChange('description', e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Área de Avaliação"
          value={dossie.evaluation_area}
          onChange={(e) => handleChange('evaluation_area', e.target.value)}
          margin="normal"
        />

        <Box display="flex" alignItems="center" gap={2} mt={2} flexWrap="wrap">
          <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
            Conceitos:
          </Typography>
          {['A', 'B', 'C', 'D', 'E'].map((c) => (
            <FormControlLabel
              key={c}
              control={
                <Checkbox
                  color="success"
                  checked={dossie.concepts.includes(c)}
                  onChange={(e) =>
                    handleChange(
                      'concepts',
                      e.target.checked
                        ? [...dossie.concepts, c]
                        : dossie.concepts.filter((x) => x !== c)
                    )
                  }
                />
              }
              label={c}
            />
          ))}
        </Box>
        {conceitosError && (
          <FormHelperText error sx={{ mt: 1 }}>
            {conceitosError}
          </FormHelperText>
        )}

        <Typography variant="h6" mt={2}>
          Categorias de Avaliação
        </Typography>

        {dossie.categories.map((cat, ci) => (
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
              {cat.descricoes.map((desc, di) => (
                <Box key={di} mb={2} pl={2} borderLeft="2px solid #ccc">
                  <TextField
                    fullWidth
                    label={`Título da Descrição ${di + 1}`}
                    value={desc.title}
                    onChange={(e) => handleDescricaoChange(ci, di, e.target.value)}
                    margin="normal"
                  />
                  {desc.quesitos.map((q, qi) => (
                    <TextField
                      key={qi}
                      fullWidth
                      label={`Quesito ${qi + 1}`}
                      value={q.titulo}
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
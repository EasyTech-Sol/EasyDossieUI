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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { apiService } from '../../services/easydossie.service';

interface Quesito {
  id: number;
  titulo: string;
}

interface Descricao {
  id: number;
  titulo: string;
  quesitos: Quesito[];
}

interface Categoria {
  id: number;
  titulo: string;
  peso: number;
  descricoes: Descricao[];
}

interface Dossie {
  id: number;
  titulo: string;
  descricao: string;
  area_avaliacao: string;
  conceitos: string[];
  categorias: Categoria[];
}

interface EditDossieModalProps {
  open: boolean;
  onClose: () => void;
  dossieData: Dossie;
  onSave: (updatedDossie: Dossie) => void;
}

export default function EditDossieModal({
  open,
  onClose,
  dossieData,
  onSave,
}: EditDossieModalProps) {
  const [dossie, setDossie] = useState<Dossie>(dossieData);
  const [conceitosError, setConceitosError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDossie(dossieData);
    setConceitosError(null);
  }, [dossieData]);

  const handleChange = (field: keyof Dossie, value: any) => {
    setDossie({ ...dossie, [field]: value });
  };

  const handleCategoriaChange = (ci: number, field: keyof Categoria, val: any) => {
    const cats = [...dossie.categorias];
    cats[ci] = { ...cats[ci], [field]: val };
    setDossie({ ...dossie, categorias: cats });
  };

  const handleDescricaoChange = (ci: number, di: number, val: string) => {
    const cats = [...dossie.categorias];
    cats[ci].descricoes[di].titulo = val;
    setDossie({ ...dossie, categorias: cats });
  };

  const handleQuesitoChange = (ci: number, di: number, qi: number, val: string) => {
    const cats = [...dossie.categorias];
    cats[ci].descricoes[di].quesitos[qi].titulo = val;
    setDossie({ ...dossie, categorias: cats });
  };

  const addCategoria = () => {
    setDossie({
      ...dossie,
      categorias: [...dossie.categorias, { id: 0, titulo: '', peso: 1, descricoes: [] }],
    });
  };

  const addDescricao = (ci: number) => {
    const cats = [...dossie.categorias];
    cats[ci].descricoes.push({ id: 0, titulo: '', quesitos: [] });
    setDossie({ ...dossie, categorias: cats });
  };

  const addQuesito = (ci: number, di: number) => {
    const cats = [...dossie.categorias];
    cats[ci].descricoes[di].quesitos.push({ id: 0, titulo: '' });
    setDossie({ ...dossie, categorias: cats });
  };

  const validarConceitos = (c: string[]) => c.length >= 3;

  const handleSave = async () => {
    if (!validarConceitos(dossie.conceitos)) {
      setConceitosError('Selecione pelo menos 3 conceitos (A, B, C, D, E).');
      return;
    }
    setConceitosError(null);
    setLoading(true);

    // 1) conceitos em string
    const conceptsString = dossie.conceitos.join(', ');

    // 2) categoryIDs
    const categoryIDs = dossie.categorias.reduce<Record<number, [string, number]>>(
      (acc, cat) => {
        if (cat.id) acc[cat.id] = [cat.titulo, cat.peso];
        return acc;
      },
      {}
    );

    // 3) descriptionIDs
    const descriptionIDs = dossie.categorias
      .flatMap((cat) =>
        cat.descricoes.map((desc) => ({ id: desc.id, tuple: [desc.titulo, cat.id] as [string, number] }))
      )
      .reduce<Record<number, [string, number]>>((acc, { id, tuple }) => {
        if (id) acc[id] = tuple;
        return acc;
      }, {});

    // 4) questionsIDs
    const questionsIDs = dossie.categorias
      .flatMap((cat) =>
        cat.descricoes.flatMap((desc) =>
          desc.quesitos.map((q) => ({
            id: q.id,
            tuple: [q.titulo, desc.id, cat.id] as [string, number, number],
          }))
        )
      )
      .reduce<Record<number, [string, number, number]>>((acc, { id, tuple }) => {
        if (id) acc[id] = tuple;
        return acc;
      }, {});

    try {
      const resp = await apiService.editDossier({
        dossierId: dossie.id,
        title: dossie.titulo,
        descriptionDossier: dossie.descricao,
        valuation_area: dossie.area_avaliacao,
        concepts: conceptsString,
        questionsIDs,
        categoryIDs,
        descriptionIDs,
      });
      onSave(resp.data.data);
      onClose();
    } catch (err: any) {
      alert('Erro ao salvar: ' + (err.response?.data?.erro || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Editar Dossiê</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Título"
          value={dossie.titulo}
          onChange={(e) => handleChange('titulo', e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Descrição"
          value={dossie.descricao}
          onChange={(e) => handleChange('descricao', e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Área de Avaliação"
          value={dossie.area_avaliacao}
          onChange={(e) => handleChange('area_avaliacao', e.target.value)}
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
                  checked={dossie.conceitos.includes(c)}
                  onChange={(e) =>
                    handleChange(
                      'conceitos',
                      e.target.checked
                        ? [...dossie.conceitos, c]
                        : dossie.conceitos.filter((x) => x !== c)
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

        {dossie.categorias.map((cat, ci) => (
          <Accordion key={ci} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{cat.titulo || `Categoria ${ci + 1}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                fullWidth
                label="Título da Categoria"
                value={cat.titulo}
                onChange={(e) => handleCategoriaChange(ci, 'titulo', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Peso"
                type="number"
                value={cat.peso}
                onChange={(e) =>
                  handleCategoriaChange(ci, 'peso', parseFloat(e.target.value) || 0)
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
                    value={desc.titulo}
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

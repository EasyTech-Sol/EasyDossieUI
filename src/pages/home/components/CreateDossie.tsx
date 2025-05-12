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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';


interface CreateDossieProps {
  open: boolean;
  onClose: () => void;
  dossieData: Dossie;
  onSave: (updatedDossie: Dossie) => void;
}

export function ExampleUsage() {
  const [open, setOpen] = useState(false);

  const mockDossie: Dossie = {
    titulo: 'Dossiê Avaliativo I Trimestre – 2025',
    descricao: 'Modelo para avaliação dos alunos do 3º ano do ensino médio.',
    area_avaliacao: 'Computação',
    categorias: [
      {
        nome: 'Comportamentos Leitores',
        descricoes: [
          { titulo: 'Interpretação de texto' },
          { titulo: 'Leitura crítica' },
        ],
      },
      {
        nome: 'Raciocínio Lógico',
        descricoes: [
          { titulo: 'Resolução de problemas' },
          { titulo: 'Pensamento computacional' },
        ],
      },
    ],
  };

  const handleSave = (updatedDossie: Dossie) => {
    console.log('Dossiê atualizado:', updatedDossie);
    setOpen(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
      >
        Editar Dossiê
      </Button>
      <CreateDossie
        open={open}
        onClose={() => setOpen(false)}
        dossieData={mockDossie}
        onSave={handleSave}
      />
    </div>
  );
}

export default function CreateDossie({ open, onClose, dossieData, onSave }: CreateDossieProps) {
  const [dossie, setDossie] = useState<Dossie | null>(null);

  useEffect(() => {
    if (dossieData) {
      setDossie(dossieData);
    }
  }, [dossieData]);

  if (!dossie) return null;

  const handleChange = (field: keyof Dossie, value: string) => {
    setDossie({ ...dossie, [field]: value });
  };

  const handleCategoriaChange = (
    index: number,
    field: keyof Categoria,
    value: string | Descricao[]
  ) => {
    const newCategorias = [...dossie.categorias];
    if (field === 'nome' && typeof value === 'string') {
      newCategorias[index].nome = value;
    }
    setDossie({ ...dossie, categorias: newCategorias });
  };

  const handleDescricaoChange = (catIdx: number, descIdx: number, value: string) => {
    const newCategorias = [...dossie.categorias];
    newCategorias[catIdx].descricoes[descIdx].titulo = value;
    setDossie({ ...dossie, categorias: newCategorias });
  };

  const addCategoria = () => {
    setDossie({
      ...dossie,
      categorias: [...dossie.categorias, { nome: '', descricoes: [] }],
    });
  };

  const addDescricao = (catIdx: number) => {
    const newCategorias = [...dossie.categorias];
    newCategorias[catIdx].descricoes.push({ titulo: '' });
    setDossie({ ...dossie, categorias: newCategorias });
  };

  const handleSave = () => {
    if (dossie) onSave(dossie);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Cadastrar Dossiê</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Nome do modelo"
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
        </Box>

        <Typography variant="h6">Categorias de Avaliação</Typography>
        {dossie.categorias.map((cat, idx) => (
          <Accordion key={idx} defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{cat.nome || `Categoria ${idx + 1}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                <TextField
                  fullWidth
                  label="Nome da categoria"
                  value={cat.nome}
                  onChange={(e) => handleCategoriaChange(idx, 'nome', e.target.value)}
                  margin="normal"
                />
                {cat.descricoes?.map((desc, dIdx) => (
                  <TextField
                    key={dIdx}
                    fullWidth
                    label={`Descrição ${dIdx + 1}`}
                    value={desc.titulo}
                    onChange={(e) => handleDescricaoChange(idx, dIdx, e.target.value)}
                    margin="normal"
                  />
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => addDescricao(idx)}
                  sx={{ mt: 1, color: '#4caf50', borderColor: '#4caf50' }}
                >
                  Adicionar Descrição
                </Button>
              </Box>
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
        <Button onClick={onClose} sx={{ color: '#000' }}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
        >
          Salvar Modelo
        </Button>
      </DialogActions>
    </Dialog>
  );
}
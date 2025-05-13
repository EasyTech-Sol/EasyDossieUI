import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { DossieList } from '../../../components/DossieList';

const dossies = [
  { id: 1, titulo: 'Dossiê 1', subtitulo: 'Máscaras de Atenção' },
  { id: 2, titulo: 'Dossiê 2', subtitulo: 'Processos Cognitivos' },
  { id: 3, titulo: 'Dossiê 3', subtitulo: 'Tarefas de Memória' },
  { id: 4, titulo: 'Dossiê 4', subtitulo: 'Funções Executivas' },
  { id: 5, titulo: 'Dossiê 5', subtitulo: 'Resolução de Problemas' }
];

export default function ListaDossiesPage() {
  const handleEdit = (id: number) => {
    console.log(`Editar dossiê com id: ${id}`);
  };

  const handleDelete = (id: number) => {
    console.log(`Excluir dossiê com id: ${id}`);
  };

  const handleAssociate = (id: number) => {
    console.log(`Associar dossiê com id: ${id}`);
  };


  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h6" gutterBottom></Typography>
      <DossieList dossies={dossies}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAssociate={handleAssociate} />
    </Box>
  );
}

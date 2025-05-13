import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { DossieList } from '../../../components/DossieList';
import { ConfirmDialog } from '../../../components/ConfirmDialog';

const initialDossies = [
  { id: 1, titulo: 'Dossiê 1', subtitulo: 'Máscaras de Atenção' },
  { id: 2, titulo: 'Dossiê 2', subtitulo: 'Processos Cognitivos' },
  { id: 3, titulo: 'Dossiê 3', subtitulo: 'Tarefas de Memória' },
  { id: 4, titulo: 'Dossiê 4', subtitulo: 'Funções Executivas' },
  { id: 5, titulo: 'Dossiê 5', subtitulo: 'Resolução de Problemas' }
];

export default function ListaDossiesPage() {

  const [dossies, setDossies] = React.useState(initialDossies);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const handleEdit = (id: number) => {
    console.log(`Editar dossiê com id: ${id}`);
  };

  const handleDeleteRequest = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      setDossies((prev) => prev.filter((d) => d.id !== selectedId));
      console.log(`Dossiê excluído com id: ${selectedId}`);
    }
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleAssociate = (id: number) => {
    console.log(`Associar dossiê com id: ${id}`);
  };


  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h6" gutterBottom></Typography>
      
      <DossieList
        dossies={dossies}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
        onAssociate={handleAssociate}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este dossiê? Essa ação não pode ser desfeita."
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}

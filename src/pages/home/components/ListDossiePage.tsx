import * as React from 'react';
import { Alert, Box, CircularProgress, Snackbar, Typography } from '@mui/material';
import { DossieList } from '../../../components/DossieList';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../services/easydossie.service';


// const initialDossies = [
//   { id: 1, titulo: 'Dossiê 1', subtitulo: 'Máscaras de Atenção' },
//   { id: 2, titulo: 'Dossiê 2', subtitulo: 'Processos Cognitivos' },
//   { id: 3, titulo: 'Dossiê 3', subtitulo: 'Tarefas de Memória' },
//   { id: 4, titulo: 'Dossiê 4', subtitulo: 'Funções Executivas' },
//   { id: 5, titulo: 'Dossiê 5', subtitulo: 'Resolução de Problemas' }
// ];

interface Dossie {
  id: number;
  titulo: string;
  descricao: string;
  area_avaliacao: string;
  conceitos: string;
  professorId: number;
}

interface DossieListItem {
  id: number;
  titulo: string;
  subtitulo: string;
}

export default function ListaDossiesPage() {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Buscar dossiês do backend
  const { data: dossies, isLoading, isError, error } = useQuery<Dossie[], Error, DossieListItem[]>({
    queryKey: ['dossies'],
    queryFn: async () => {
      const response = await apiService.getDossies();
      return response.data; // Extrai os dados da resposta Axios
    },
    select: (data) => data.map(dossie => ({
      id: dossie.id,
      titulo: dossie.titulo,
      subtitulo: dossie.descricao,
    })),
  });

  // Mutação para deletar um dossiê
  const deleteDossieMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteDossie(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dossies'] });
      setSnackbar({
        open: true,
        message: 'Dossiê excluído com sucesso!',
        severity: 'success',
      });
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message: `Erro ao excluir dossiê: ${error.message}`,
        severity: 'error',
      });
    },
  });

  const handleEdit = (id: number) => {
    console.log(`Editar dossiê com id: ${id}`);
    // Faltando a navegação pra essa parte
  };

  const handleDeleteRequest = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      deleteDossieMutation.mutate(selectedId);
    }
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleAssociate = (id: number) => {
    console.log(`Associar dossiê com id: ${id}`);
    // Faltando a navegação pra essa parte
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
        <Alert severity="error">
          Ocorreu um erro ao carregar os dossiês: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', mt: 4, px: 2 }}>
      
      <DossieList
        dossies={dossies || []}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

import * as React from "react";
import { Alert, Box, CircularProgress, Snackbar } from "@mui/material";
import { DossierList } from "../../../components/DossierList";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../../../services/easydossie.service";
import { Dossier, DossierListItem } from "../../../types/dossier";

export default function ListDossierPage() {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Buscar dossiês do backend
  const {
    data: dossiers,
    isLoading,
    isError,
    error,
  } = useQuery<Dossier[], Error, DossierListItem[]>({
    queryKey: ["dossiers"],
    queryFn: async () => {
      const response = await apiService.getDossiers();
      return response.data; 
    },
    select: (data) =>
      data.map((dossier) => ({
        id: dossier.id,
        title: dossier.title,
        description: dossier.description,
      })),
  });

  // Mutação para deletar um dossiê
  const deleteDossierMutation = useMutation({
    mutationFn: (id: number) => apiService.deleteDossier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dossiers"] });
      setSnackbar({
        open: true,
        message: "Dossiê excluído com sucesso!",
        severity: "success",
      });
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message: `Erro ao excluir dossiê: ${error.message}`,
        severity: "error",
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
      deleteDossierMutation.mutate(selectedId);
    }
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleAssociate = (id: number) => {
    console.log(`Associar dossiê com id: ${id}`);
    // Faltando a navegação pra essa parte
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
        <Alert severity="error">
          Ocorreu um erro ao carregar dossiês: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <DossierList
        dossiers={dossiers || []}
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

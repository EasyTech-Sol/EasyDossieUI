import * as React from "react";
import { Alert, Box, Snackbar } from "@mui/material";
import { DossierList } from "../../../components/DossierList";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { apiService } from "../../../services/easydossie.service";
import { isAxiosError } from "axios";
import { useDossiers } from "../../../contexts/DossierContext";

import AssociateDossierClass from "../components/AssociateDossierClass";

export default function ListDossierPage() {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [associateModalOpen, setAssociateModalOpen] = React.useState(false);
  const [selectedDossierId, setSelectedDossierId] = React.useState<number | null>(null);


  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const { dossiers, setDossiers, loading } = useDossiers();

  // Mutação para deletar um dossiê
  const deleteDossie = async (id: number) => {

    try {
      await apiService.deleteDossier(id)
      setDossiers(prev => prev.filter(d => d.id !== id))
      setSnackbar({
        open: true,
        message: `Dossiê excluído com sucesso!`,
        severity: "success",
      })

    } catch (error) {
      if (isAxiosError(error))
        setSnackbar({
          open: true,
          message: `Erro ao excluir dossiê: ${error.message}`,
          severity: "error",
        });
      else
        setSnackbar({
          open: true,
          message: `Erro desconhecido ao excluir dossiê`,
          severity: "error",
        });
    }
  }

  const handleDeleteRequest = (id: number) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      deleteDossie(selectedId)
    }
    setConfirmOpen(false);
    setSelectedId(null);
  };

  const handleAssociate = (id: number) => {
    setSelectedDossierId(id);
    setAssociateModalOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <DossierList
        // dossiers={dossiers}
        // onEdit={handleEdit}
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {selectedDossierId !== null && (
      <AssociateDossierClass
        open={associateModalOpen}
        onClose={() => {
          setAssociateModalOpen(false);
          setSelectedDossierId(null);
        }}
        dossierId={selectedDossierId}
      />
    )}
    </Box>
  );
}

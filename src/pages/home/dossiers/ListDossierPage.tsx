import * as React from "react";
import { Box } from "@mui/material";
import { DossierList } from "../../../components/DossierList";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { apiService } from "../../../services/easydossie.service";
import { isAxiosError } from "axios";
import { useDossiers } from "../../../contexts/DossierContext";
import AssociateDossierClass from "../components/AssociateDossierClass";
import { useSnackbar } from "../../../contexts/SnackBarContext.tsx";

interface ListDossierPageProps {
  dossiers: Dossier[];
}

export default function ListDossierPage({ dossiers }: ListDossierPageProps) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [associateModalOpen, setAssociateModalOpen] = React.useState(false);
  const [selectedDossierId, setSelectedDossierId] = React.useState<number | null>(null);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const { setDossiers } = useDossiers();
  const { showMessage } = useSnackbar();

  // Mutação para deletar um dossiê
  const deleteDossie = async (id: number) => {
    try {
      await apiService.deleteDossier(id);
      setDossiers(prev => prev.filter(d => d.id !== id));
      showMessage("Dossiê excluído com sucesso!", "success"); 
    } catch (error) {
      if (isAxiosError(error)) {
        showMessage(`Erro ao excluir dossiê: ${error.message}`, "error");
      } else {
        showMessage("Erro desconhecido ao excluir dossiê", "error");
      }
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

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4, px: 2 }}>
      <DossierList
        dossiers={dossiers}
        onDelete={handleDeleteRequest}
        onAssociate={handleAssociate}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirmar exclusão"
        description={
          "Tem certeza que deseja excluir este dossiê? " +
          "Se ele estiver associado a alguma turma, todas as avaliações e vínculos dessas turmas com este dossiê serão permanentemente apagados. " +
          "Esta ação é irreversível!"
        }
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

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

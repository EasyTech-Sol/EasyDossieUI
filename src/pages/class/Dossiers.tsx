import { Delete } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useState } from "react";
import type { DossierListItem } from "../../types/dossier";

interface DossiersProps {
  dossiers: DossierListItem[];
  handleDeleteDossier: (dossierClassId: number) => void;
}

const drawerWidth = 240;

const Dossiers = ({ dossiers, handleDeleteDossier }: DossiersProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(null);

  const handleOpenDialog = (id: number) => {
    setSelectedDossierId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDossierId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedDossierId !== null) {
      handleDeleteDossier(selectedDossierId); 
    }
    handleCloseDialog();
  };

  return (
    <>
      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {dossiers.map((dossier) => {
          const template = dossier.dossierTemplate;
          return (
            <Paper
              key={dossier.id}
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 2,
                borderBottom: "1px solid #ddd",
              }}
            >
              <Box>
                <Typography variant="h6">{template.title}</Typography>
                <Typography variant="body2">{template.description}</Typography>
              </Box>
              <IconButton sx={{ color: "black" }} onClick={() => handleOpenDialog(dossier.id)}>
                <Delete fontSize="small" />
              </IconButton>
            </Paper>
          );
        })}
      </Box>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este dossiê? Esta operação <strong>não poderá ser desfeita</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dossiers;

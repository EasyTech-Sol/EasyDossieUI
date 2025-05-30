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
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface DossiersProps {
  dossiers: Dossier[];
  handleDeleteDossier: ({ classId, dossierId }: ClassDossier) => void;
}


const drawerWidth = 240;

const Dossiers = ({ dossiers, handleDeleteDossier }: DossiersProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState<ClassDossier | undefined>();
  const navigate = useNavigate()
  const classId = Number(useParams().classId)

  const handleOpenDialog = (classId: number, dossierId: number) => {
    setSelectedDossierId({ classId, dossierId });
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedDossierId(undefined);
  };

  const handleConfirmDelete = () => {
    if (selectedDossierId !== undefined) {
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
        {dossiers.map((d) => (
          <Paper
            key={d.id}
            elevation={3}
            sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: 2, borderBottom: "1px solid #ddd" }}
          >
            <Box>
              <Typography variant="h6">{d.title}</Typography>
              <Typography variant="body2">{d.description}</Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/class/${classId}/dossier/${d.id}/evaluation`,
                  { state: {} }
                )}
              >Avaliar</Button>
              <IconButton onClick={() =>
                handleOpenDialog(classId, d.id)
              }>
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))}

      </Box>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Desassociação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja desassociar este dossiê desta turma? Esta operação <strong>não poderá ser desfeita</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dossiers;

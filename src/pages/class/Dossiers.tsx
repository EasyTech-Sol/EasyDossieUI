import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

interface DossiersProps {
  dossiers: Dossier[];
  handleDeleteDossier: ({ classId, dossierId }: ClassDossier) => void;
}

const Dossiers = ({ dossiers, handleDeleteDossier }: DossiersProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState<ClassDossier | undefined>();
  const navigate = useNavigate();
  const classId = Number(useParams().classId);

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
          px: 4,
          maxWidth: "800px",
          width: "100%",
          mx: "auto",
        }}
      >
        <List sx={{ width: "100%" }}>
          {dossiers.map((d) => (
            <ListItem
              key={d.id}
              disableGutters
              sx={{
                mb: 2,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                padding: 2,
                boxShadow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "transform 0.1s ease-in",
                maxWidth: "700px",
                mx: "auto",
                "&:hover": {
                  transform: "scale(1.01)",
                },
              }}
            >
              {/* Avatar */}
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#c8e6c9", color: "#1b5e20" }}>
                  {d.title.charAt(0)}
                </Avatar>
              </ListItemAvatar>

              {/* Texto (com largura limitada) */}
              <Box
                sx={{
                  ml: 2,
                  mr: 2,
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,
                  overflow: "hidden",
                }}
              >
                <Tooltip title={d.title}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                    }}
                  >
                    {d.title}
                  </Typography>
                </Tooltip>

                <Tooltip title={d.description}>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "text.secondary",
                    }}
                  >
                    {d.description}
                  </Typography>
                </Tooltip>
              </Box>

              {/* Ações */}
              <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() =>
                    navigate(`/class/${classId}/dossier/${d.id}/evaluation`)
                  }
                >
                  Avaliar
                </Button>
                <IconButton onClick={() => handleOpenDialog(classId, d.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Desassociação</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja desassociar este dossiê desta turma? Esta operação{" "}
            <strong>não poderá ser desfeita</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dossiers;

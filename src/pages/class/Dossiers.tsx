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
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Fab,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import AddIcon from '@mui/icons-material/Add';
import { apiService } from "../../services/easydossie.service";
import { useSnackbar } from "../../contexts/SnackBarContext";

interface DossiersProps {
  dossiers: Dossier[];
  setDossiers: React.Dispatch<React.SetStateAction<Dossier[]>>;
  handleDeleteDossier: ({ classId, dossierId }: ClassDossier) => void;
}

const Dossiers = ({ dossiers, setDossiers, handleDeleteDossier }: DossiersProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState<ClassDossier | undefined>();
  const [associateOpen, setAssociateOpen] = useState(false);
  const [availableDossiers, setAvailableDossiers] = useState<Dossier[]>([]);
  const [selectedDossiers, setSelectedDossiers] = useState<number[]>([]);
  const [loadingDossiers, setLoadingDossiers] = useState(false);
  const [associating, setAssociating] = useState(false);
  const { showMessage } = useSnackbar();
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

  // Buscar dossiês disponíveis para associação
  const fetchAvailableDossiers = async () => {
    setLoadingDossiers(true);
    try {
      const res = await apiService.getDossiers();
      // Filtra os que já estão associados
      const associatedIds = dossiers.map(d => d.id);
      setAvailableDossiers(res.data.dossiers.filter((d: Dossier) => !associatedIds.includes(d.id)));
    } catch (e) {
      showMessage("Erro ao buscar dossiês disponíveis.", "error");
    } finally {
      setLoadingDossiers(false);
    }
  };

  useEffect(() => {
    if (associateOpen) fetchAvailableDossiers();
  }, [associateOpen]);

  const handleAssociate = async () => {
    if (!selectedDossiers.length) return;
    setAssociating(true);
    try {
      await Promise.all(selectedDossiers.map(dossierId => apiService.associateDossierToClasses(dossierId, [classId])));
      showMessage("Dossiê associado com sucesso!", "success");
      // Atualizar a lista localmente
      const novosDossies = availableDossiers.filter(d => selectedDossiers.includes(d.id));
      setDossiers(prev => [...prev, ...novosDossies]);
      setSelectedDossiers([]);
      setAssociateOpen(false);
    } catch (e) {
      showMessage("Erro ao associar dossiê.", "error");
    } finally {
      setAssociating(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          px: 4,
          maxWidth: "800px",
          width: "100%",
          mx: "auto",
          position: 'relative',
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
        {/* Botão flutuante de adicionar dossiê */}
        <Fab
          color="success"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 10,
          }}
          onClick={() => setAssociateOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Box>

      {/* Modal de associação de dossiê */}
      <Dialog open={associateOpen} onClose={() => setAssociateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Associar Dossiê à Turma</DialogTitle>
        <DialogContent>
          {loadingDossiers ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={120}>
              <CircularProgress />
            </Box>
          ) : availableDossiers.length === 0 ? (
            <Typography align="center" color="text.secondary">
              Nenhum dossiê disponível para associar.
            </Typography>
          ) : (
            <Box>
              {availableDossiers.map((d) => (
                <FormControlLabel
                  key={d.id}
                  control={
                    <Checkbox
                      checked={selectedDossiers.includes(d.id)}
                      onChange={(_, checked) => {
                        setSelectedDossiers((prev) =>
                          checked
                            ? [...prev, d.id]
                            : prev.filter((id) => id !== d.id)
                        );
                      }}
                    />
                  }
                  label={d.title}
                />
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssociateOpen(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleAssociate}
            color="success"
            variant="contained"
            disabled={associating || !selectedDossiers.length}
          >
            {associating ? "Associando..." : "Associar"}
          </Button>
        </DialogActions>
      </Dialog>

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

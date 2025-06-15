import * as React from "react";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Box,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import EditDossieModal from "../pages/home/dossiers/EditDossierModal";
import { useDossiers } from "../contexts/DossierContext";
import DossierView from "./DossieView";

interface DossierListProps {
  dossiers: Dossier[];
  onDelete?: (id: number) => void;
  onAssociate?: (id: number) => void;
}

export const DossierList: React.FC<DossierListProps> = ({
  dossiers,
  onDelete,
  onAssociate,
}) => {
  const emptyDossie: Dossier = {
    id: 0,
    title: '',
    description: '',
    evaluationArea: '',
    categories: [],
    concepts: "A,B,C",
    teacherId: ""
  };
  const { setDossiers } = useDossiers();
  const [editModal, setEditModal] = React.useState(false)
  const [viewModal, setViewModal] = React.useState(false)
  const [dossierToEdit, setDossierToEdit] = React.useState<Dossier>(emptyDossie)
  const [dossierToView, setDossierToView] = React.useState<Dossier>(emptyDossie)

  const onEdit = (dossier: Dossier) => {
    setDossierToEdit(dossier)
    setEditModal(true)
  }

  const handleEdit = (data: any) => {
    setDossiers(prev => prev.map(d => d.id === data.id ? data : d))
  }

  return (
    <>
      <EditDossieModal
        open={editModal}
        dossierData={dossierToEdit}
        onClose={() => setEditModal(false)}
        onSave={handleEdit}
      />
      <Box sx={{ px: 4 }}>
        <List sx={{ width: "100%" }}>
          {dossiers.map((dossier) => (
            <ListItem
              key={dossier.id}
              disableGutters
              onClick={() => {
                setDossierToView(dossier)
                setViewModal(true)
              }}
              sx={{
                mb: 2,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                padding: 2,
                width: "100%",
                boxShadow: 1,
                alignItems: "center",
                transition: "transform 0.1s ease-in",
                "&:hover": {
                  transform: "scale(1.01)",
                },
                display: "flex",
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#c8e6c9", color: "#1b5e20" }}>
                  {dossier.title.charAt(0)}
                </Avatar>
              </ListItemAvatar>

              {/* CONTAINER FLEX DO TEXTO */}
              <Box
                sx={{
                  ml: 2,
                  mr: 2,                    
                  flexGrow: 1,
                  flexShrink: 1,
                  minWidth: 0,             
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <Tooltip title={dossier.title}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                    }}
                  >
                    {dossier.title}
                  </Typography>
                </Tooltip>

                <Tooltip title={dossier.description}>
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "text.secondary",
                    }}
                  >
                    {dossier.description}
                  </Typography>
                </Tooltip>
              </Box>

              {/* BOTOES */}
              <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(dossier.id)
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(dossier)
                  }}
                >
                  <ModeEditIcon />
                </IconButton>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAssociate?.(dossier.id)
                  }}
                >
                  ASSOCIAR
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>

        <DossierView
          dossier={dossierToView}
          open={viewModal}
          onClose={() => setViewModal(false)} />
      </Box>
    </>
  );
};

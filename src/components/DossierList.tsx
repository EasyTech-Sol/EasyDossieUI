import * as React from "react";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import EditDossieModal from "../pages/home/dossiers/EditDossierModal";
import { useDossiers } from "../contexts/DossierContext";
import DossierView from "./DossieView";

interface DossierListProps {
  // dossiers: Dossier[];
  // onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAssociate?: (id: number) => void;
}

export const DossierList: React.FC<DossierListProps> = ({
  // dossiers,
  // onEdit,
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
  const { dossiers, setDossiers, loading } = useDossiers();
  const [editModal, setEditModal] = React.useState(false)
  const [viewModal, setViewModal] = React.useState(false)
  const [dossierToEdit, setDossierToEdit] = React.useState<Dossier>(emptyDossie)
  const [dossierToView, setDossierToView] = React.useState<Dossier>(emptyDossie)

  const onEdit = (dossier: Dossier) => {
    setDossierToEdit(dossier)
    setEditModal(true)
  }

  const handleEdit = (data: any) => {
    setDossiers(prev => [...prev, data])
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
              onClick={() => {
                setDossierToView(dossier)
                setViewModal(true)
              }}
              key={dossier.id}
              sx={{
                mb: 2,
                backgroundColor: "#ffffff", // Agora é fundo branco
                borderRadius: 2,
                padding: 2,
                width: "100%",
                boxShadow: 1,
                display: "flex",
                alignItems: "center",
                transition: "transform 0.1s ease-in",
                "&:hover": {
                  transform: "scale(1.01)",
                }
              }}
              secondaryAction={
                <Box sx={{ display: "flex", gap: 1 }}>
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
                    sx={{ ml: 1 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onAssociate?.(dossier.id)
                    }}
                  >
                    ASSOCIAR
                  </Button>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#c8e6c9", color: "#1b5e20" }}>
                  {dossier.title.charAt(0)}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={dossier.title}
                secondary={dossier.description}
                sx={{ ml: 2 }}
              />
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

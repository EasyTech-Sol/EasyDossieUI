import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Toolbar,
  Fab,
  Snackbar,
  Alert,
} from "@mui/material";

import { useEffect, useState } from "react";
import { Add, Person } from "@mui/icons-material";
import { isAxiosError } from "axios";
import { apiService } from "../../../services/easydossie.service.ts";
import CreateDossie from "./CreateDossie.tsx";
import ListDossiersPage from "./ListDossierPage.tsx";
import Search from "../../../components/Search.tsx";
import { useDossiers } from "../../../contexts/DossierContext.tsx";
import { useSnackbar } from "../../../contexts/SnackbarContext.tsx";

const drawerWidth = 240;


const DossiersDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { setDossiers, loading } = useDossiers();

  const emptyDossie: Dossier = {
    id: 0,
    title: '',
    description: '',
    evaluation_area: '',
    categories: [],
    concept: "A,B,C",
    teacherId: ""
  };
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { showMessage  } = useSnackbar();


  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateDossie = async ({ templateData }: DossierInput) => {
    try {
      const result = await apiService.createDossier({
        templateData
      });

      const newDossier = result.data.template;

      setDossiers(prev => [...prev, newDossier])

      showMessage("Dossiê criado com sucesso!", "success");
    } catch (error) {
      if (isAxiosError(error)) {
        showMessage(error.response?.data?.error || "Erro desconhecido.", "error");      } else {
        showMessage("Erro ao criar dossiê.", "error");
      }
      }
    setDialogOpen(false);
  };

  return (
    <>
      {/* Top AppBar */}
      <AppBar position="relative" color="transparent" elevation={0}>
        <Toolbar
          sx={{
            flexDirection: "column",
            alignItems: "stretch",
            gap: 1,
            margin: 1
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton>
              <Person />
            </IconButton>
          </Box>

          <Divider />

          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Search value={searchTerm} onChange={setSearchTerm} />
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          position: "relative",
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >

        {/* Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            mt: 2,
            px: 2,
            width: "100%",
          }}
        >
          <ListDossiersPage />
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="success"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
          }}
          onClick={handleOpenDialog}

        >
          <Add />
        </Fab>
        <CreateDossie
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleCreateDossie}
          dossieData={emptyDossie}
        />
      </Box>
    </>
  );
};

export default DossiersDashboard;
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Toolbar,
  Fab,
} from "@mui/material";

import { useState } from "react";
import { Add, Person } from "@mui/icons-material";
import { isAxiosError } from "axios";
import { apiService } from "../../../services/easydossie.service.ts";
import CreateDossie from "./CreateDossie.tsx";
import ListDossiersPage from "./ListDossierPage.tsx";
import Search from "../../../components/Search.tsx";
import { useDossiers } from "../../../contexts/DossierContext.tsx";
import { useSnackbar } from "../../../contexts/SnackBarContext.tsx";

const drawerWidth = 240;

const DossiersDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { dossiers, setDossiers } = useDossiers();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { showMessage } = useSnackbar();

  const [currentDossier, setCurrentDossier] = useState<Dossier | null>(null);

  // Filtra os dossiês com base no termo de busca
  const filteredDossiers = dossiers.filter(dossier => 
    dossier.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dossier.evaluationArea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emptyDossie: Dossier = {
    id: 0,
    title: '',
    description: '',
    evaluationArea: '',
    categories: [],
    concepts: "A,B,C",
    teacherId: ""
  };

  const handleOpenDialog = () => {
    setCurrentDossier({
      id: 0,
      title: '',
      description: '',
      evaluationArea: '',
      categories: [],
      concepts: "A,B,C",
      teacherId: ""
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentDossier(null);  // limpa ao fechar
  };

  const handleCreateDossie = async ({ templateData }: DossierInput): Promise<boolean> => {
    try {
      const result = await apiService.createDossier({ templateData });
      const newDossier = result.data.template;
      setDossiers(prev => [...prev, newDossier]);
      showMessage("Dossiê criado com sucesso!", "success");
      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        showMessage(error.response?.data?.error || "Erro desconhecido.", "error");
      } else {
        showMessage("Erro ao criar dossiê.", "error");
      }
      return false;
    }
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

          <Box sx={{ display: "flex", justifyContent: "center", mt: 1, width: "100%" }}>
            <Box sx={{ width: "100%", maxWidth: "1000px", px: 2 }}>
              <Search 
                value={searchTerm} 
                onChange={setSearchTerm}
                placeholder="Buscar por título, descrição ou área..."
              />
            </Box>
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
          <ListDossiersPage dossiers={filteredDossiers} />
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

        {dialogOpen && (
          <CreateDossie
            open={dialogOpen}
            onClose={handleCloseDialog}
            onSave={handleCreateDossie}
            dossieData={currentDossier || emptyDossie}
          />
        )}
      </Box>
    </>
  );
};

export default DossiersDashboard;
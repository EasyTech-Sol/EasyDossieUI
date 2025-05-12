import {
  AppBar,
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Snackbar,
  Fab,
} from "@mui/material";
import { Add, Person, Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import { apiService } from "../../../services/easydossie.service.ts";
import CreateDossie from "./CreateDossie.tsx";
const drawerWidth = 240;

const DossiersDashboard = () => {

  const [classes, setDossies] = useState<Dossie[]>([])
  const [editModalOpened, setEditModalOpened] = useState(false)
  const emptyDossie: Dossie = {
    titulo: '',
    descricao: '',
    area_avaliacao: '',
    categorias: [],
  };
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateDossie = async (data: Dossie) => {
    try {
      const result = await apiService.createDossie(data);
      const newClass = result.data;
      setDossies(prev => [...prev, newClass])
      setSnackbar({
        open: true,
        message: "Dossie criado com sucesso!",
        severity: "success",
      });
    } catch (error) {
      if (isAxiosError(error))
        if (error.status === 403)
          window.location.href = "auth/sign-in"
        else
          setSnackbar({
            open: true,
            message: error.response?.data.error,
            severity: "error",
          });
      else
        setSnackbar({
          open: true,
          message: "Erro ao criar dossie.",
          severity: "error",
        });
    }
    setDialogOpen(false);
  };


  return (
      <>
        {/* Main */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            position: "relative",
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
  
          {/* Top AppBar */}
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar
              sx={{
                flexDirection: "column",
                alignItems: "stretch",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton>
                  <Person />
                </IconButton>
              </Box>
  
              <Divider />
  
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Paper
                  component="form"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: 600,
                    px: 2,
                    py: 0.5,
                  }}
                >
                  <Search />
                  <InputBase
                    placeholder="Buscar dossiês..."
                    inputProps={{ "aria-label": "buscar dossiês" }}
                    sx={{ ml: 1, flex: 1 }}
                  />
                </Paper>
              </Box>
            </Toolbar>
          </AppBar>

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
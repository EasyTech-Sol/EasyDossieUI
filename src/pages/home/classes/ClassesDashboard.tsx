import {
  Box,
  Fab,
  useTheme,
  Snackbar,
  Alert,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Divider
} from "@mui/material";
import {
  Add,
  Person,
} from "@mui/icons-material";

import { useEffect, useState } from "react";
import CreateClass from "./CreateClass.tsx";
import ClassCard from "./ClassCard.tsx"
import { apiService } from "../../../services/easydossie.service.ts";
import { getRandomMutedColor } from "../../../helpers/softColors.ts";
import EditClassModal from "./EditClassModal.tsx";
import { isAxiosError } from "axios";


import Search from "../../../components/Search.tsx"; // ajuste o caminho conforme necessário

const drawerWidth = 240;

const ClassesDashboard = () => {
  const theme = useTheme();
  const [classes, setClasses] = useState<Class[]>([])
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editModalOpened, setEditModalOpened] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const [classToEdit, setClassToEdit] = useState<Class>({
    title: "0",
    id: 0,
    shift: "",
    lectivePeriod: "",
    institution: ""
  })

  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateClass = async (data: Class) => {
    try {
      const result = await apiService.createClass(data);
      const newClass = result.data;
      setClasses(prev => [...prev, newClass])
      setSnackbar({
        open: true,
        message: "Turma criada com sucesso!",
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
          message: "Erro ao criar turma.",
          severity: "error",
        });
    }
    setDialogOpen(false);
  };

  const handleEditClass = (id: number) => {
    setEditModalOpened(true);
    setClassToEdit(classes.find(c => c.id === id)!)
  }

  const handleCloseEdit = () => {
    setEditModalOpened(false)
    setClassToEdit({
      title: "0",
      id: 0,
      shift: "",
      lectivePeriod: "",
      institution: ""
    })
  }

  const handleDeleteClass = async (id: number) => {
  try {
    await apiService.deleteClass(id);
    setClasses(prev => prev.filter(cls => cls.id !== id));
  } catch (error) {
    if (isAxiosError(error)) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Erro ao apagar turma.",
        severity: "error",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Erro ao apagar turma.",
        severity: "error",
      });
    }
  }
}

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchClassesList = async () => {
      try {
        const result = await apiService.getClasses();
        setClasses(result.data.classes ?? []);
      } catch (error) {
          console.error(error);  // <-- usando a variável 'error'
          setSnackbar({
            open: true,
            message: "Erro ao listar turmas.",
            severity: "error",
          });
      }
    };

    fetchClassesList();
  }, []);

  return (
    <>
      {/* Main */}

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

      <Container>
        <Box
          marginTop={"1rem"}
          display={"flex"}
          justifyContent={"flex-start"}
          flexWrap={"wrap"}
          alignItems={"flex-start"}
          gap={"1rem"}
          flexDirection={"row"}
        >
          {classes
          .filter(cls => 
            cls.title?.toLowerCase().includes(searchTerm.toLowerCase())).map(cls => (
              <ClassCard
                id={cls.id}
                key={cls.id}
                title={cls.title}
                onEdit={() => handleEditClass(cls.id)}
                onDelete={() => handleDeleteClass(cls.id)}
                bgColor={getRandomMutedColor()}
              />
            ))}
        </Box>
      </Container>



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

      {/* Diálogo de criação */}
      <CreateClass
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleCreateClass}
      />

      <EditClassModal
        open={editModalOpened}
        handleClose={handleCloseEdit}
        classToEdit={classToEdit}
        setClasses={setClasses}
      />
      {/* Snackbar de feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ClassesDashboard;

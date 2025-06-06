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
import { useSnackbar } from "../../../contexts/SnackBarContext.tsx";

import Search from "../../../components/Search.tsx"; 

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
    institution: "",
    color: ""
  })

  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const { showMessage } = useSnackbar();


  const handleCreateClass = async (data: Class) => {
    try {
      const result = await apiService.createClass({...data, color:getRandomMutedColor()});
      const newClass = result.data as Class;
      setClasses(prev => [...prev, newClass]);
      showMessage("Turma criada com sucesso!", "success"); 
      setDialogOpen(false); 
    } catch (error) {
      console.error("Erro ao criar turma:", error); 
      let message = "Erro desconhecido ao criar turma.";
      if (isAxiosError(error)) {
        if (error.response?.status === 403) {
          showMessage("Sessão expirada ou acesso negado. Redirecionando para login...", "warning");
          setTimeout(() => {
            window.location.href = "/auth/sign-in"; 
          }, 2500);
          return;
        }
        // Tentativa de pegar mensagens de erro mais específicas
        if (error.response?.data?.error) {
          message = String(error.response.data.error);
        } else if (error.response?.data?.message) {
          message = String(error.response.data.message);
        } else if (error.message) {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      showMessage(message, "error");
    }
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
      institution: "",
      color: ""
    })
  }

  const handleDeleteClass = async (id: number) => {
    try {
      await apiService.deleteClass(id);
      setClasses(prev => prev.filter(cls => cls.id !== id));
      showMessage("Turma excluída com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao apagar turma:", error);
      let message = "Erro desconhecido ao apagar turma.";
      if (isAxiosError(error)) {
        if (error.response?.status === 403) {
          showMessage("Sessão expirada ou acesso negado. Redirecionando para login...", "warning");
          setTimeout(() => {
            window.location.href = "/auth/sign-in";
          }, 2500);
          return;
        }
        if (error.response?.data?.error) {
          message = String(error.response.data.error);
        } else if (error.response?.data?.message) {
          message = String(error.response.data.message);
        } else if (error.message) {
          message = error.message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }
      showMessage(message, "error");
    }
  };

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
                bgColor={cls.color}
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

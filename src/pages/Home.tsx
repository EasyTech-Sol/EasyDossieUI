import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Fab,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert
} from "@mui/material";
import {
  Add,
  Description,
  ExitToApp,
  Info,
  Person,
  School,
  Search,
} from "@mui/icons-material";
import { useState } from "react";
import CreateClass from "./auth/components/CreateClass.tsx";
import Logo from "../assets/logo.svg";
import ClassCard from "./home/components/ClassCard.tsx"
import { useNavigate } from "react-router-dom";
import { apiService } from "../services/easydossie.service.ts";

const drawerWidth = 240;

const DrawerContent = ({
  selectedTab,
  onLogout,
}: {
  selectedTab: "turmas" | "dossies";
  onLogout: () => void;
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <Box>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <img src={Logo} alt="Logo" style={{ height: 40 }} />
      </Box>
      <List>
        <ListItemButton selected={selectedTab === "turmas"}>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary="Turmas" />
        </ListItemButton>
        <ListItemButton disabled selected={selectedTab === "dossies"}>
          <ListItemIcon>
            <Description />
          </ListItemIcon>
          <ListItemText primary="Dossiês" />
        </ListItemButton>
      </List>
    </Box>
    <Box sx={{ mt: "auto" }}>
      <List>
        <ListItemButton>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary="Sobre" />
        </ListItemButton>
        <ListItemButton onClick={onLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </List>
    </Box>
  </Box>
);

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab] = useState<"turmas" | "dossies">("turmas");

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/sign-in");
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCreateTurma = async (data: TurmaData) => {
    try {
      await apiService.createTurma(data);
      setSnackbar({
        open: true,
        message: "Turma criada com sucesso!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Erro ao criar turma.",
        severity: "error",
      });
    }
    setDialogOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          <DrawerContent selectedTab={selectedTab} onLogout={handleLogout} />
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          }}
        >
          <DrawerContent selectedTab={selectedTab} onLogout={handleLogout} />
        </Drawer>
      )}

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
                  placeholder="Buscar turmas..."
                  inputProps={{ "aria-label": "buscar turmas" }}
                  sx={{ ml: 1, flex: 1 }}
                />
              </Paper>
            </Box>
          </Toolbar>
        </AppBar>

        <Box marginTop={"1rem"} display={"flex"} justifyContent={"space-between"}
          flexWrap={"wrap"} alignItems={"center"} gap={"2rem"}>
          <ClassCard />
          <ClassCard />
          <ClassCard />
          <ClassCard />
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

        {/* Diálogo de criação */}
        <CreateClass
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleCreateTurma}
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
      </Box>
    </Box>
  );
};

export default Home;

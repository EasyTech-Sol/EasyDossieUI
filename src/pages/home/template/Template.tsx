import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  useTheme,
  useMediaQuery,
  Container
} from "@mui/material";
import {
  Person,
  Search,
} from "@mui/icons-material";

import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DrawerContent from "../components/DrawerContent.tsx";

const drawerWidth = 240;

const Template = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab] = useState<"turmas" | "dossies">("turmas");
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/sign-in");
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

        <Container>
          <Outlet />
        </Container>

      </Box>
    </Box>
  );
};

export default Template;

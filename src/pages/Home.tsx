import {AppBar,Box,  Divider,Drawer,IconButton,InputBase,List,ListItemButton,ListItemIcon,ListItemText,Paper,Toolbar,Fab,useTheme,useMediaQuery,} from "@mui/material"
import {Add,Description,ExitToApp, Info,Person,School,Search,} from "@mui/icons-material"
import { useState } from "react"
import Logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom"

const drawerWidth = 240

const DrawerContent = ({ selectedTab,  onLogout,}: { selectedTab: "turmas" | "dossies", onLogout: () => void}) => (
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
)

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedTab] = useState<"turmas" | "dossies">("turmas") // para ficar fixado em "turmas"
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/auth/sign-in") 
  }


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
          <DrawerContent selectedTab={selectedTab} onLogout={handleLogout}/>
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

        {/* Floating Action Button */}
        <Fab
          color="success"
          sx={{
            position: "absolute",
            bottom: 32,
            right: 32,
          }}
        >
          <Add />
        </Fab>
      </Box>
    </Box>
  )
}

export default Home

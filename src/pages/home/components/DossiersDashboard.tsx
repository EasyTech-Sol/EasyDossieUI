import {
  AppBar,
  Box,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Fab,
} from "@mui/material";


import { useState } from "react";
import { Add, Person,  } from "@mui/icons-material";
const drawerWidth = 240;

import Search from "../../../components/Search.tsx"; // ajuste o caminho conforme necessário


const DossiersDashboard = () => {

  const [searchTerm, setSearchTerm] = useState("");


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
              <Search value={searchTerm} onChange={setSearchTerm} />
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
      >
        <Add />
      </Fab>
    </Box>
      </>
  );
};

export default DossiersDashboard;
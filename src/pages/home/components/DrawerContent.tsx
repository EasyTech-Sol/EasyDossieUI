import { Description, ExitToApp, Info, School } from "@mui/icons-material";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import Logo from "../../../assets/logo.svg"

export default ({
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

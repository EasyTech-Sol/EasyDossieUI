import { Description, ExitToApp, Info, School } from "@mui/icons-material";
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import Logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default ({
    selectedTab,
    onTabChange,
    onLogout,
}:
    {
        selectedTab: "turmas" | "dossies";
        onTabChange: (tab: "turmas" | "dossies") => void;
        onLogout: () => void;
    }) => {

    const navigate = useNavigate();

    const navigateHome = () => {
        onTabChange("turmas");
        navigate("/home");

    }


    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box>
                <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
                    <img src={Logo} alt="Logo" style={{ height: 40 }} onClick={navigateHome} />
                </Box>
                <List>
                    <ListItemButton
                        selected={selectedTab === "turmas"}
                        onClick={navigateHome}
                    >
                        <ListItemIcon>
                            <School />
                        </ListItemIcon>
                        <ListItemText
                            primary="Turmas"
                            sx={{
                                color: selectedTab === "turmas" ? "text.primary" : "text.secondary",
                            }}
                        />
                    </ListItemButton>
                    <ListItemButton
                        selected={selectedTab === "dossies"}
                        onClick={() => {
                            onTabChange("dossies");
                            navigate("/dossiers");
                        }}
                    >
                        <ListItemIcon>
                            <Description />
                        </ListItemIcon>
                        <ListItemText
                            primary="Dossiês"
                            sx={{
                                color: selectedTab === "dossies" ? "text.primary" : "text.secondary",
                            }}
                        />
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
};
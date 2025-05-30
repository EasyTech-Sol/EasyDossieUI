import {
    Box,
    Drawer,
    useTheme,
    useMediaQuery
} from "@mui/material";

import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import DrawerContent from "./DrawerContent.tsx";
import { useEffect } from "react";
import { Snackbar, Alert } from '@mui/material';
import { useSnackbar } from "../../contexts/SnackBarContext.tsx"; 

const drawerWidth = 240;

const MainLayout = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState<"turmas" | "dossies">("turmas");
    const navigate = useNavigate();
    const { open, setOpen, message, severity } = useSnackbar();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth/sign-in");
    };

    // Redireciona com base na aba selecionada
    useEffect(() => {
        if (selectedTab === "dossies") {
            navigate("/dossiers");
        } else if (selectedTab === "turmas") {
            navigate("/home");
        }
    }, [selectedTab, navigate]);

    const handleClose = () => {
        setOpen(false);
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
                    <DrawerContent
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        onLogout={handleLogout}
                    />
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
                    <DrawerContent
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        onLogout={handleLogout}
                    />
                </Drawer>
            )}
            <Box display={"flex"} flexDirection={"column"} width={"100%"} alignItems={"center"}>
                <Outlet />
            </Box>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={severity} variant="filled">
                {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MainLayout;

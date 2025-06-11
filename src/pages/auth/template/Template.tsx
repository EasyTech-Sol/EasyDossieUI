import { Alert, Box, Grid, Snackbar, SnackbarCloseReason } from "@mui/material";
import { Outlet } from "react-router-dom";
import teacherImg from "../../../assets/teacher-bg.jpeg";
import logo from "../../../assets/logo.svg"
import { useSnackbar } from "../../../contexts/SnackBarContext";

export default function Template() {
    const { message, open, setOpen } = useSnackbar()

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false)
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert severity="error" sx={{ my: 2 }}>{message}</Alert>
            </Snackbar>
            <Grid container sx={{ height: '100vh' }}>
                {/* Lado esquerdo com imagem */}
                <Grid size={5} height={"100vh"}>
                    <Box
                        component="img"
                        src={teacherImg}
                        alt="teacher"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                        }}
                    />
                </Grid>

                {/* Lado direito com conteúdo */}
                <Grid size={7}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        width='100%'
                        height='100%'
                    >
                        <Box width={"90%"} gap={"2.5rem"} display={"flex"} height={"90%"} justifyContent={"space-between"} flexDirection={"column"} alignItems={"center"}>
                            <img src={logo} width={"40%"} alt="" />
                            <Box
                                width={"60%"} height={"90%"}>
                                <Outlet />
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid >
        </>
    );
}

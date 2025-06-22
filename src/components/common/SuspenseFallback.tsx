import { Box, CircularProgress, Typography } from '@mui/material'

const SuspenseFallback = () => {
    return (
        <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: 'translate(-50%, -50%)' }}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
        >
            <CircularProgress size="3rem" color="success" />
            <Typography
                variant="h6"
                color="success"
                sx={{ mt: 2 }}>
                Carregando...
            </Typography>
        </Box>

    )
}

export default SuspenseFallback
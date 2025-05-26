import { NavigateNext, Person } from '@mui/icons-material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { AppBar, Box, Breadcrumbs, Button, Divider, IconButton, Toolbar, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

const EvaluationAppBar = () => {
    const classId = Number(useParams().classId)
    const navigate = useNavigate()

    const breadcrumbs = [
        <Typography variant="h6" sx={{ ml: 1, color: '#37474f' }}>{"title"}</Typography>
    ]


    return (
        <>
            <AppBar position="relative" color="transparent" elevation={0}>
                <Toolbar
                    sx={{
                        flexDirection: "column",
                        alignItems: "stretch",
                        gap: 1,
                    }}
                >

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "4.5rem" }}>
                        <Button
                            onClick={() => navigate(`/class/${classId}`)}
                            sx={{ textTransform: "none" }}
                            startIcon={<ArrowBackIosNewIcon sx={{ color: '#37474f' }} />}
                        >
                            <Typography variant="h6" sx={{ ml: 1, color: '#37474f' }}>
                                Voltar
                            </Typography>
                        </Button>

                        <IconButton size='large'>
                            <Person />
                        </IconButton>
                    </Box>

                    <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}


                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Breadcrumbs
                            separator={<NavigateNext fontSize="small" />}
                            aria-label="breadcrumb"
                        >
                            {breadcrumbs}
                        </Breadcrumbs>
                    </Box>

                    <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}
                </Toolbar>

            </AppBar>
        </>
    )
}

export default EvaluationAppBar
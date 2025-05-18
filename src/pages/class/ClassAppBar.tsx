import { NavigateNext, Person } from '@mui/icons-material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { AppBar, Box, Breadcrumbs, Button, Divider, IconButton, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTabsContext } from '../../contexts/TabContext';

const ClassAppBar = () => {
    const { title } = useLocation().state
    const { selectedSubTab, setSelectedSubTab } = useTabsContext();
    const navigate = useNavigate()
    const handleSubTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setSelectedSubTab(newValue as "dossies" | "alunos") // Altera subaba ativa
    }

    const breadcrumbs = [
        <Typography variant="h6" sx={{ ml: 1, color: '#37474f' }}>{title}</Typography>
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
                            onClick={() => navigate("/home")}
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

                    {/* Centralizar Tabs e manter ícone à direita */}
                    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
                        <Tabs
                            value={selectedSubTab}
                            onChange={handleSubTabChange}
                            textColor="primary"
                            indicatorColor="primary"
                            aria-label="tabs de conteúdo"
                            TabIndicatorProps={{ sx: { height: 3 } }} // opcional: deixa o indicador mais grosso
                        >
                            <Tab
                                value="dossies"
                                label="Dossiês"
                                sx={{ fontSize: "1rem", fontWeight: 500, mx: 20 }}

                            />
                            <Tab
                                value="alunos"
                                label="Alunos"
                                sx={{ fontSize: "1rem", fontWeight: 500, mx: 20 }}
                            />
                        </Tabs>
                    </Box>

                    <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}

                </Toolbar>

            </AppBar>
        </>
    )
}

export default ClassAppBar
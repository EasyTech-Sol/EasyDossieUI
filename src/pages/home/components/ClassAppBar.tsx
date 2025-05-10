import { Person, Search } from '@mui/icons-material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { AppBar, Box, Button, Divider, IconButton, InputBase, Paper, Tab, Tabs, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ClassAppBar = () => {
    const [selectedTab] = useState<"turmas" | "dossies">("turmas") // Aba principal fixa em "turmas"
    const [selectedSubTab, setSelectedSubTab] = useState<"dossies" | "alunos">("alunos") // Subaba ativa ("alunos" ou "dossies")
    const navigate = useNavigate()
    const handleSubTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setSelectedSubTab(newValue as "dossies" | "alunos") // Altera subaba ativa
    }

    return (
        <>
            <AppBar position="absolute" color="transparent" elevation={0}>
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

                    <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}


                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            py: 1,
                        }}
                    >
                        <Button
                            onClick={() => navigate("/home")}
                            sx={{ textTransform: "none" }}
                            startIcon={<ArrowBackIosNewIcon sx={{ color: '#37474f' }} />}
                        >
                            <Typography variant="h6" sx={{ ml: 1, color: '#37474f' }}>
                                Voltar
                            </Typography>
                        </Button>
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

                    <Box sx={{ display: "flex", justifyContent: "right", mt: 1 }}>
                        <Paper
                            component="form"
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                maxWidth: 400,
                                px: 2,
                                py: 0.5,
                                borderRadius: "999px", // deixa super arredondado
                                boxShadow: 1, // sombra leve
                            }}
                        >
                            <Search color="action" />
                            <InputBase
                                placeholder="Buscar alunos..."
                                inputProps={{ "aria-label": "buscar alunos" }}
                                sx={{ ml: 1, flex: 1 }}
                            />
                        </Paper>
                    </Box>



                </Toolbar>

            </AppBar>
            <Box sx={{ height: 300 }} />
        </>
    )
}

export default ClassAppBar
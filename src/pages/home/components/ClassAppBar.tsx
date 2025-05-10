import { Person, Search } from '@mui/icons-material'
import { AppBar, Box, Divider, IconButton, InputBase, Paper, Tab, Tabs, Toolbar } from '@mui/material'
import React, { useState } from 'react'

const ClassAppBar = () => {
    const [selectedTab] = useState<"turmas" | "dossies">("turmas") // Aba principal fixa em "turmas"
    const [selectedSubTab, setSelectedSubTab] = useState<"dossies" | "alunos">("alunos") // Subaba ativa ("alunos" ou "dossies")

    const handleSubTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setSelectedSubTab(newValue as "dossies" | "alunos") // Altera subaba ativa
    }

    return (
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
    )
}

export default ClassAppBar
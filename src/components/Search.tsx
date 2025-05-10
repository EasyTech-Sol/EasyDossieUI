import { Box, InputBase, Paper } from '@mui/material'
import {Search as SearchInput} from '@mui/icons-material'

const Search = () => {
    return (

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
                <SearchInput color="action" />
                <InputBase
                    placeholder="Buscar alunos..."
                    inputProps={{ "aria-label": "buscar alunos" }}
                    sx={{ ml: 1, flex: 1 }}
                />
            </Paper>
        </Box>
    )
}

export default Search
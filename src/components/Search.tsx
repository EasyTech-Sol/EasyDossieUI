import { Box, InputBase, Paper } from '@mui/material'
import {Search as SearchInput} from '@mui/icons-material'

interface SearchProps {
    value: string;
    onChange: (value: string) => void;
  }
  
  const Search = ({ value, onChange }: SearchProps) => {
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
            borderRadius: "999px",
            boxShadow: 1,
          }}
          onSubmit={(e) => e.preventDefault()}
        >
          <SearchInput color="action" />
          <InputBase
            placeholder="Buscar..."
            inputProps={{ "aria-label": "buscar" }}
            sx={{ ml: 1, flex: 1 }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </Paper>
      </Box>
    )
  }
  
  export default Search;
  
Search.tsx

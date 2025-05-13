import * as React from 'react';
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface Dossie {
  id: number;
  titulo: string;
  subtitulo: string;
}

interface DossieListProps {
  dossies: Dossie[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAssociate?: (id: number) => void;
}

export const DossieList: React.FC<DossieListProps> = ({
  dossies,
  onEdit,
  onDelete,
  onAssociate
}) => {
  
    return (
        <Box sx={{ px: 4 }}> 
          <List sx={{ width: '100%' }}>
            {dossies.map((dossie) => (
              <ListItem
                key={dossie.id}
                sx={{
                  mb: 2,
                  backgroundColor: '#e6f4ec',
                  borderRadius: 2,
                  padding: 2,
                  width: '100%',
                  boxShadow: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDelete?.(dossie.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => onEdit?.(dossie.id)}
                    >
                      <ModeEditIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() => onAssociate?.(dossie.id)}
                    >
                      ASSOCIAR
                    </Button>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#e5d5ff', color: '#4b0082' }}>
                    {dossie.titulo.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={dossie.titulo}
                  secondary={dossie.subtitulo}
                  sx={{ ml: 2 }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
    );
      
      

};

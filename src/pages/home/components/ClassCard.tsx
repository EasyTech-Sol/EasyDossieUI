import React, { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
  Divider,
  Box,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function CustomCard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleClose();
    console.log("Editar clicado");
    // lógica para editar
  };

  const handleDelete = () => {
    handleClose();
    console.log("Excluir clicado");
    // lógica para excluir
  };

  return (
    <Card sx={{ borderRadius: "20px", width: "15rem", height: "10rem" }}>
      <CardActionArea
        sx={{
          height: '100%',
          '&[data-active]': {
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: 'action.selectedHover',
            },
          },
        }}
      >
        <CardContent sx={{ height: '100%' }}>
          <Box display={"flex"} flexDirection={"row"}
            justifyContent={"space-between"} alignItems={"center"}>
            <Typography variant="h5" component="div">
              6° Ano A
            </Typography>

            <Tooltip title="Opções">
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleEdit}>Editar turma</MenuItem>
              <MenuItem onClick={handleDelete}>Excluir turma</MenuItem>
            </Menu>
          </Box>
          <Divider />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

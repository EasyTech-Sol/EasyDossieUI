import React, { useState } from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Typography,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  CardHeader,
  Checkbox,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { truncateString } from '../../../helpers/string';
import { useNavigate } from 'react-router-dom';

interface ClassCardProps {
  title: string
  bgColor: string
  id: number
  onEdit?: () => void;
  onDelete?: () => void;
  selectMode?: boolean; // prop para controlar o modo seleção
  selected?: boolean;   // prop para marcar o card como selecionado
}

export default function ClassCard({ title, bgColor, id, onEdit, onDelete, selectMode = false, selected = false, }: ClassCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation()
    handleClose();
    onEdit?.(); // Executa onEdit() apenas se ela foi fornecida via props.
    // lógica para editar
  };

  const handleDelete = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.stopPropagation()
    handleClose();
    onDelete?.(); /// Executa onDelete() apenas se ela foi fornecida via props.
    // lógica para excluir
  };

  return (
    <Card
      sx={{ borderRadius: "20px", width: "15rem", height: "12rem" }}>
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
        onClick={() =>{
          if (!selectMode) { // Navega para a turma apenas se não estiver no modo seleção
            navigate(`/class/${id}`, { state: { title, classId: id } });
          }}
        }
      >
        <CardHeader
          sx={{ bgcolor: bgColor, color: 'white' }}
          title={
            <Typography variant="h6" component="div">
              {truncateString(title, 10)}
            </Typography>
          }
          action={ (onEdit || onDelete) && (
              <>
                <Tooltip title="Opções">
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    handleClick(e);
                  }}>
                    <MoreVertIcon sx={{ color: "white" }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClick={(e) => e.stopPropagation()}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {onEdit && <MenuItem onClick={(e) => handleEdit(e)}>Editar turma</MenuItem>}
                  {onDelete && <MenuItem onClick={(e) => handleDelete(e)}>Excluir turma</MenuItem>}
                </Menu>
              </>
            )}
        />
        <Divider />

        <CardContent sx={{ height: '100%', backgroundColor: "#E2E2E2" }}>
        </CardContent>
        
        {selectMode && (
          <Checkbox
            checked={selected}
            sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            color: 'white', 
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '& .MuiSvgIcon-root': {
              fontSize: 22, 
            },
          }}
          disableRipple
          />
        )}

      </CardActionArea>
    </Card>
  );
}

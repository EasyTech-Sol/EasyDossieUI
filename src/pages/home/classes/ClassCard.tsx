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
  Box,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { truncateString } from '../../../helpers/string';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface ClassCardProps {
  title: string
  bgColor: string
  id: number
  studentsCount?: number
  dossiersCount?: number
  onEdit?: () => void;
  onDelete?: () => void;
  selectMode?: boolean; // prop para controlar o modo seleção
  selected?: boolean;   // prop para marcar o card como selecionado
  centerIcons?: boolean; // novo: controla centralização vertical dos ícones
}

export default function ClassCard({ title, bgColor, id, studentsCount, dossiersCount, onEdit, onDelete, selectMode = false, selected = false, centerIcons = false }: ClassCardProps) {
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
      sx={{ borderRadius: '20px', width: '15rem', height: '12rem', position: 'relative', overflow: 'hidden' }}>
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
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {onEdit && <MenuItem onClick={(e) => handleEdit(e)}>Editar turma</MenuItem>}
                  {onDelete && <MenuItem onClick={(e) => handleDelete(e)}>Excluir turma</MenuItem>}
                </Menu>
              </>
            )}
        />
        <Divider />

        <CardContent
          sx={
            centerIcons
              ? {
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#E2E2E2',
                  p: 0,
                  height: 'calc(100% - 64px)',
                }
              : {
                  height: '100%',
                  backgroundColor: '#E2E2E2',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  p: 0,
                  position: 'relative',
                }
          }
        >
          {studentsCount !== undefined && dossiersCount !== undefined && (
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} width="100%">
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="#fff" px={1.2} py={0.7} borderRadius={2} boxShadow={1} minWidth={60}>
                <PeopleIcon sx={{ fontSize: 20, color: '#757575' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: 15, lineHeight: 1 }}>
                  {studentsCount ?? 0}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ fontSize: 11 }}>
                  Alunos
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="#fff" px={1.2} py={0.7} borderRadius={2} boxShadow={1} minWidth={60}>
                <AssignmentIcon sx={{ fontSize: 20, color: '#757575' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: 15, lineHeight: 1 }}>
                  {dossiersCount ?? 0}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ fontSize: 11 }}>
                  Dossiês
                </Typography>
              </Box>
            </Box>
          )}
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

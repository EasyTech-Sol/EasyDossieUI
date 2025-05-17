import * as React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import ClassCard from '../classes/ClassCard';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AssociateClassModalProps {
  open: boolean;
  onClose: () => void;
}

const mockedClasses = [
  { id: 1, title: 'Turma A', bgColor: '#1976d2' },
  { id: 2, title: 'Turma B', bgColor: '#388e3c' },
  { id: 3, title: 'Turma C', bgColor: '#f57c00' },
];

export default function AssociateDossierClass({ open, onClose }: AssociateClassModalProps) {
  const handleSelectClass = (classId: number) => {
    console.log(`Turma selecionada para associação: ${classId}`);
    // Aqui você pode disparar uma ação de associação
  };

  return (
    <Dialog
      open={open}
      slots={{ transition: Transition }}
      keepMounted
      onClose={onClose}
      aria-describedby="associate-class-description"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Associar a uma turma</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          Selecione uma turma da lista abaixo para associar o dossiê:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
            mt: 2,
          }}
        >
          {mockedClasses.map((classItem) => (
            <Box key={classItem.id} onClick={() => handleSelectClass(classItem.id)}>
              <ClassCard
                id={classItem.id}
                title={classItem.title}
                bgColor={classItem.bgColor}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}

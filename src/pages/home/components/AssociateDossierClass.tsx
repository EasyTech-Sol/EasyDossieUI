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
  { id: 4, title: 'Turma D', bgColor: '#7b1fa2' },
  { id: 5, title: 'Turma E', bgColor: '#0097a7' },
  { id: 6, title: 'Turma F', bgColor: '#c2185b' },
  { id: 7, title: 'Turma G', bgColor: '#512da8' },
  { id: 8, title: 'Turma H', bgColor: '#00796b' },
  { id: 9, title: 'Turma I', bgColor: '#455a64' },
  { id: 10, title: 'Turma J', bgColor: '#5d4037' },
  { id: 11, title: 'Turma K', bgColor: '#0288d1' },
  { id: 12, title: 'Turma L', bgColor: '#afb42b' },
];

export default function AssociateDossierClass({ open, onClose }: AssociateClassModalProps) {
   // Estado para guardar as turmas selecionadas (permite múltipla seleção)
   const [selectedClasses, setSelectedClasses] = React.useState<number[]>([]);

  const handleSelectClass = (classId: number) => {
    setSelectedClasses((prevSelected) =>
      prevSelected.includes(classId)
        ? prevSelected.filter((id) => id !== classId)
        : [...prevSelected, classId]
    );
  };

  
  const handleConfirm = () => {
    console.log('Turmas selecionadas para associação:', selectedClasses);
    // Aqui você pode disparar a ação real de associação
    onClose();
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
          {mockedClasses.map((classItem) => {
            const isSelected = selectedClasses.includes(classItem.id);
            return (
              <Box key={classItem.id} onClick={() => handleSelectClass(classItem.id)}>
                <ClassCard
                  id={classItem.id}
                  title={classItem.title}
                  bgColor={classItem.bgColor}
                  selectMode // Habilita modo seleção para exibir checkbox
                  selected={isSelected} // Indica se está selecionado
                />
              </Box>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>

        <Button
          onClick={handleConfirm}
          disabled={selectedClasses.length === 0}
          variant="contained"
          color="success"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

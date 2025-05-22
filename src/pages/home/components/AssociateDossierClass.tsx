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
import { useState, useEffect } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import ClassCard from '../classes/ClassCard';
import { apiService } from "../../../services/easydossie.service";
import { getRandomMutedColor } from '../../../helpers/softColors';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface AssociateClassModalProps {
  open: boolean;
  onClose: () => void;
  dossierId: number;
}

export default function AssociateDossierClass({ open, onClose, dossierId }: AssociateClassModalProps) {

  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [classList, setClassList] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [errorClasses, setErrorClasses] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      setErrorClasses(null);

      try {
        const response = await apiService.getClasses();
        setClassList(response.data.classes);

      } catch (error: any) {
        console.error(error);
        setErrorClasses('Erro ao carregar as turmas.');
      } finally {
        setLoadingClasses(false);
      }
    };

    if (open) {
      fetchClasses();
    }
  }, [open]);

  const handleSelectClass = (classId: number) => {
    setSelectedClasses((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };
  
  const handleConfirm = async () => {
    if (selectedClasses.length === 0) return;

    setLoading(true);
    try {
      await apiService.associateDossierToClasses(dossierId, selectedClasses);

      setMessage("Associação realizada com sucesso!");
      onClose();

    } catch (error: any) {
      console.error(error);
      setMessage("Erro ao associar dossiê.");

    } finally {
      setLoading(false);
    }
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

        {loadingClasses && (
          <Typography align="center" sx={{ mt: 2 }}>
            Carregando turmas...
          </Typography>
        )}

        {errorClasses && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {errorClasses}
          </Typography>
        )}

        {!loadingClasses && !errorClasses && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            {classList.map((classItem) => (
              <Box key={classItem.id} onClick={() => handleSelectClass(classItem.id)}>
                <ClassCard
                  id={classItem.id}
                  title={classItem.title}
                  bgColor={getRandomMutedColor()}
                  selectMode
                  selected={selectedClasses.includes(classItem.id)}
                />
              </Box>
            ))}
          </Box>
        )}

        {message && (
          <Typography sx={{ mt: 2 }} color="error">
            {message}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color='success'>Cancelar</Button>
        <Button onClick={handleConfirm} disabled={loading || selectedClasses.length === 0} variant="contained" color="success">
          {loading ? "Associando..." : "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

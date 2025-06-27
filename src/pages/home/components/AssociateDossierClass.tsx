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
import { useSnackbar } from '../../../contexts/SnackBarContext'; 


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
  const [classList, setClassList] = useState<any[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [associatedClassIds, setAssociatedClassIds] = useState<number[]>([]);

  const { showMessage } = useSnackbar(); // Hook do contexto

  useEffect(() => {
  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const response = await apiService.getClasses();
      setClassList(response.data.classes);

      // Buscar turmas já associadas ao dossiê
      const assocRes = await apiService.getClassesByDossier(dossierId);
      const assocIds = assocRes.data.associatedClasses?.map((c: any) => c.classId || c.class?.id) || [];
      setAssociatedClassIds(assocIds);

      showMessage(
        response.data.message || 'Turmas carregadas com sucesso.',
        response.data.type || 'success'
      );
    } catch (error: any) {
      showMessage(
        error.response?.data?.message || 'Erro ao carregar as turmas.',
        error.response?.data?.type || 'error'
      );
    } finally {
      setLoadingClasses(false);
    }
  };

  if (open) {
    fetchClasses();
  }
}, [open, dossierId]);


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
      showMessage('Associação realizada com sucesso!', 'success');
      onClose();

    } catch (error: any) {
      const backendMessage = error.response?.data?.message;
      const backendType = error.response?.data?.type;

      showMessage(
        backendMessage || 'Erro ao associar dossiê.',
        backendType || 'error'
      );
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

        {!loadingClasses && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            {classList
              .filter((classItem) => !associatedClassIds.includes(classItem.id))
              .map((classItem) => (
                <Box
                  key={classItem.id}
                  onClick={() => handleSelectClass(classItem.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ClassCard
                    id={classItem.id}
                    title={classItem.title}
                    bgColor={getRandomMutedColor()}
                    selectMode
                    selected={selectedClasses.includes(classItem.id)}
                  />
                </Box>
              ))}
            {classList.filter((classItem) => !associatedClassIds.includes(classItem.id)).length === 0 && (
              <Typography align="center" color="text.secondary" sx={{ width: '100%' }}>
                Todas as turmas já estão associadas a este dossiê.
              </Typography>
            )}
          </Box>
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

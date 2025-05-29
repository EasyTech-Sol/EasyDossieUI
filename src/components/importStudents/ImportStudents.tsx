import { useState, useEffect } from 'react';
import "./importstudents.css"
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/easydossie.service';
import { AxiosResponse } from 'axios';

import { Button, /* Stack, Alert, AlertTitle, */ Modal, Typography, Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from '@mui/material'; // Stack, Alert, AlertTitle não serão mais usados para este feedback
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from '../../contexts/SnackBarContext';

interface ImportStudentsProps {
  classId: number;
  registerDropzoneRoot: ReturnType<typeof useDropzone>['getRootProps'];
  registerDropzoneInput: ReturnType<typeof useDropzone>['getInputProps'];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  excelData: Student[];
  setExcelData: React.Dispatch<React.SetStateAction<Student[]>>;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>; 
}

export default function ImportStudents({ classId,
  registerDropzoneInput, registerDropzoneRoot,
  open, setOpen, excelData, setExcelData, setStudents }: ImportStudentsProps) {

  const { showMessage } = useSnackbar(); 

  const mutation = useMutation<AxiosResponse<{ success: Student[], errors?: any[] }>, Error, void>({
    mutationFn: () => apiService.importStudents(classId, excelData),
    onSuccess: ({ data }) => {

      if (data && data.success && Array.isArray(data.success)) {
        showMessage(`${data.success.length} aluno(s) importado(s) com sucesso!`, 'success');
        setStudents(prev => [...prev, ...data.success]);
      } else {
        showMessage('Importação concluída, mas dados de sucesso não foram retornados como esperado.', 'warning');
      }
      setExcelData([]);
    },
    onError: (error) => { 
      console.error(error.message);
      showMessage(error.message || 'Erro ao enviar os dados. Tente novamente.', 'error');
    },
  });


  const handleDelete = (indexToDelete: number) => {
    setExcelData((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="import-container">
      <div {...registerDropzoneRoot()}>
        <input {...registerDropzoneInput()} />
      </div>

      {}

      <Modal
        open={open}
        onClose={() => {
          setOpen(false); 
          setExcelData([]); 
        }}
        disableEscapeKeyDown
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-box" sx={{ position: 'relative' }}>
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpen(false);
              setExcelData([]); 
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="modal-title" variant="h6" component="h2" className="modal-title">
            Pré-visualização dos alunos
          </Typography>

          {excelData.length > 0 ? (
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {excelData.map((aluno, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{aluno.name?.[0]?.toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={aluno.name}
                    secondary={aluno.registration}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography id="modal-description" sx={{ mt: 2 }}>
              Nenhum dado encontrado.
            </Typography>
          )}

          <Button
            variant="contained"
            color="success"
            onClick={() => mutation.mutate()}
            className="save-button"
            disabled={mutation.isPending || excelData.length === 0}
            sx={{ mt: 2 }}
          >
            {mutation.isPending ? "Importando..." : "Importar Alunos"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
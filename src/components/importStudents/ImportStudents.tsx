import { useState } from 'react';
import "./importstudents.css"
import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from '@tanstack/react-query';
import { apiService } from '../../services/easydossie.service';
import { AxiosResponse } from 'axios';

import { Button, Stack, Alert, AlertTitle, Modal, Typography, Box, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';


interface ImportStudentsProps {
  classId: number;
  registerDropzoneRoot: ReturnType<typeof useDropzone>['getRootProps'];
  registerDropzoneInput: ReturnType<typeof useDropzone>['getInputProps'];  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  excelData: Student[]
  setExcelData: React.Dispatch<React.SetStateAction<Student[]>>
  setStudents: React.Dispatch<React.SetStateAction<any[]>>
}

export default function ImportStudents({ classId: classId,
  registerDropzoneInput, registerDropzoneRoot,
  open, setOpen, excelData, setExcelData, setStudents }: ImportStudentsProps) {
  // Armazena mensagens de erro
  const [error, setError] = useState<string | null>(null);
  // Armazena mensagens de sucesso
  const [success, setSuccess] = useState<string | null>(null);

  // Mutação para enviar os dados para o backend
  const mutation = useMutation<AxiosResponse<any>, Error, void>({
    mutationFn: () => apiService.importStudents(classId, excelData),
    onSuccess: ({ data }) => {
      setSuccess('Dados enviados com sucesso!');
      setStudents(prev => [...prev, ...data.success])
      setError(null);
      setExcelData([]);
    },
    onError: (error) => {
      console.error(error.message);
      setError('Erro ao enviar os dados. Tente novamente.');
    },
  });

  // Efeito para fazer os alerts sumirem após 3 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 3000);

      return () => clearTimeout(timer); /// Evita vazamentos de memória
    }
  }, [error, success]);


  // Função para remover um aluno da lista com base no índice
  const handleDelete = (indexToDelete: number) => {
    // Atualiza o estado excelData, filtrando todos os alunos EXCETO o que está na posição indexToDelete
    setExcelData((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="import-container">
      <div {...registerDropzoneRoot()}>
        <input {...registerDropzoneInput()} />
      </div>

      <Stack sx={{ width: '100%' }} spacing={2} className="alert-stack">
        {error && (
          <Alert severity="error">
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        {success && (
          <Alert severity="success">
            <AlertTitle>Upload feito com sucesso</AlertTitle>

          </Alert>
        )}
      </Stack>

      <Modal
        open={open}
        onClose={() => { }}
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
            <List dense>
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
                    <Avatar>{aluno.name?.[0]}</Avatar> {/* Inicial do nome */}
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
          >
            Salvar
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

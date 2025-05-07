import { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
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
  classId: number; // Id da turma que será passado via props
}

export type Student = {
  name: string;
  registration: string | number;
};

type RawStudent = {
  [key: string]: string | number;
};

export default function ImportStudents({classId: classId}: ImportStudentsProps) {
  // Armazena os dados extraídos do arquivo Excel
  const [excelData, setExcelData] = useState<Student[]>([]);
  // Armazena mensagens de erro
  const [error, setError] = useState<string | null>(null);
  // Armazena mensagens de sucesso
  const [success, setSuccess] = useState<string | null>(null);
  // Controla a visibilidade do modal de pré-visualização
  const [open, setOpen] = useState(false);
  // Função para abrir o modal
  const handleOpen = () => setOpen(true);
  // Função para fechar o modal
  const handleClose = () => setOpen(false);

  const mutation = useMutation<AxiosResponse<void>, Error, void>({
    mutationFn: () => apiService.importStudents(classId, excelData),
    onSuccess: () => {
      setSuccess('Dados enviados com sucesso!');
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

  // Função auxiliar para detectar separador CSV
  const detectDelimiter = (csvText: string): string => {
    const firstLine = csvText.split('\n')[0];
    const commaCount = firstLine.split(',').length;
    const semicolonCount = firstLine.split(';').length;
    return commaCount >= semicolonCount ? ',' : ';';
  };

  // Função para normalizar e validar os dados importados
  const processStudentData = (rawData: RawStudent[]) => {
    const jsonData: Student[] = rawData.map((item) => {
      const keys = Object.keys(item);
      let name = '';
      let registration: string | number = '';

      keys.forEach((key) => {
        const normalizedKey = key
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, '')
          .replace(/[^\w]/g, '');

        if (normalizedKey.includes('nome')) name = String(item[key]);
        if (normalizedKey.includes('matricula')) registration = item[key];
      });

      return { name, registration };
    });

    const isValid = jsonData.every(
      (item) =>
        typeof item.name === 'string' &&
        item.name.trim() !== '' &&
        (typeof item.registration === 'string' || typeof item.registration === 'number') &&
        `${item.registration}`.trim() !== ''
    );

    if (!isValid) {
      setError('Formato inválido. Certifique-se de que cada linha contenha "nome" e "matricula".');
      setExcelData([]);
      return;
    }

    setExcelData(jsonData);
    setError(null);
    setSuccess('Arquivo carregado com sucesso!');
    handleOpen();
  };

  // Função responsável por processar o arquivo Excel carregado pelo usuário 
  const handleExcelParse = (file: File) => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvText = e.target?.result as string;
        const delimiter = detectDelimiter(csvText);

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          delimiter,
          complete: (results) => {
            const rawData = results.data as RawStudent[];
            processStudentData(rawData);
          },
          error: () => {
            setError('Erro ao processar o arquivo CSV.');
          },
        });
      };
      reader.readAsText(file, 'utf-8');
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const reader = new FileReader();
    
      // Quando o arquivo for carregado, processa os dados
      reader.onload = (e) => {
        const data = e.target?.result;
        try {
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const rawData = XLSX.utils.sheet_to_json<RawStudent>(worksheet, { defval: '' });
          processStudentData(rawData);
        } catch (err) {
          console.error(err);
          setError('Erro ao processar o arquivo Excel.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setError('Formato de arquivo não suportado.');
    }
  };

  // Função chamada quando o usuário seleciona um arquivo manualmente pelo botão
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // Pega o primeiro arquivo da lista
    if (file) {
      handleExcelParse(file); // Processa o arquivo Excel selecionado
    }
  }, []);

  // Configura o hook useDropzone apenas para usar o seletor de arquivos (sem área visível de drop)
  const { getRootProps, getInputProps, open: openFileDialog } = useDropzone({
    onDrop, // Função que será chamada quando o usuário escolher um arquivo
    noClick: true,
    noKeyboard: true,
    accept: { // Define os tipos de arquivos permitidos (somente Excel)
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false, // Limita o upload a um único arquivo por vez
  });

  // Função para remover um aluno da lista com base no índice
  const handleDelete = (indexToDelete: number) => {
    // Atualiza o estado excelData, filtrando todos os alunos EXCETO o que está na posição indexToDelete
    setExcelData((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="import-container">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
      </div>

      <Button variant="contained" onClick={openFileDialog}>
        Importar alunos (csv)
      </Button>

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
        onClose={() => {}} 
        disableEscapeKeyDown 
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-box" sx={{ position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={() => {
            handleClose();
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

import { useCallback, useState } from 'react';
import * as XLSX from 'xlsx';
import "./importstudents.css"
import { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { sendStudentsToServer } from '../../api/APISendToStudentds';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

interface ImportStudentsProps {
  classId: number; // Id da turma que será passado via props
}

export type Student = {
  name: string;
  registration: string | number;
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

  const mutation = useMutation<void, Error, void>({
    mutationFn: () => sendStudentsToServer(classId, excelData),
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

  // Função responsável por processar o arquivo Excel carregado pelo usuário 
  const handleExcelParse = (file: File) => {
    const reader = new FileReader();
    
    // Quando o arquivo for carregado, processa os dados
    reader.onload = (e) => {
      const data = e.target?.result;
      try {
        // Lê o arquivo como planilha
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheetName = workbook.SheetNames[0]; // Pega o nome da primeira aba
        const worksheet = workbook.Sheets[worksheetName]; // Acessa a primeira aba

        // Converte os dados da aba em um array de objetos
        type RawStudent = {
          [key: string]: string | number;
        };
        const rawData: RawStudent[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        // Mapeia os dados para o formato Student, normalizando os nomes das colunas
        const jsonData: Student[] = rawData.map((item) => {
          const keys = Object.keys(item);
          let name: string = '';
          let registration: string | number = '';
        
          // Normaliza o nome da coluna: remove acentos, espaços e caracteres especiais
          keys.forEach((key) => {
            const normalizedKey = key
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '')
              .replace(/[^\w]/g, '');
            
              // Procura por colunas que contenham 'nome' ou 'matricula'
              if (normalizedKey.includes('nome')) {
                name = String(item[key]);
              }
              if (normalizedKey.includes('matricula')) {
                registration = item[key];
              }
            });
          
            return { name, registration };
        });
          
        // Verifica se o arquivo contém dados válidos
        if (!jsonData || jsonData.length === 0) {
          setError('O arquivo está vazio ou não contém dados.');
          setExcelData([]);
          return;
        }
        
        // Valida se todos os objetos possuem nome e matrícula válidos
        const isValid = jsonData.every(
          (item: Student) =>
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
        
        // Se tudo estiver certo, salva os dados no estado e mostra o modal
        setExcelData(jsonData as Student[]);
        setError(null);
        setSuccess('Arquivo carregado com sucesso!');
        handleOpen(); // Abre o modal com a pré-visualização
      } catch (err) {
        console.error(err);
        setError('Erro ao processar o arquivo Excel.');
        setExcelData([]);
      }
    };
  
    reader.readAsArrayBuffer(file); // Lê o conteúdo do arquivo
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

  // Envia os dados dos alunos para o backend
  const handleSendToServer = async () => {
    try {
      // Monta o payload com turmaId e os dados dos alunos
      const payload = {
        classId: classId,
        students: excelData
      };

      console.log("Dados que devem enviados ao backend:", JSON.stringify(payload, null, 2));

      // Envia os dados para o backend via POST
      const response = await fetch('http://localhost:5173/importarAlunos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar para o servidor');
      }

      const resData = await response.json();
      setSuccess('Dados enviados com sucesso!');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Falha ao enviar os dados. Verifique a conexão ou tente novamente.');
    }
  };

  return (
    <div className="import-container">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
      </div>

      <Button variant="contained" onClick={openFileDialog}>
        Importar alunos (.xls/.xlsx)
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
        onClose={() => {}} // ← desativa o clique fora
        disableEscapeKeyDown // ← desativa ESC
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

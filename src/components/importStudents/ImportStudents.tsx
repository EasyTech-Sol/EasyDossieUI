import { useCallback, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import "./importstudents.css"

import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

type Aluno = {
  nome: string;
  matricula: string | number;
  };

export default function ImportStudents() {
  // Estado que armazena os dados lidos do Excel em formato de array de objetos
  const [excelData, setExcelData] = useState<any[]>([]);

  // Estado para armazenar o arquivo Excel carregado
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Função que será chamada quando um arquivo for solto ou selecionado
  const onDrop = useCallback((files: File[]) => {
    const uploadedFile = files[0]; // Pega o primeiro arquivo enviado (esperando apenas 1)
    setFile(uploadedFile); // Armazena o arquivo no estado
    // console.log(uploadedFile)

    // Cria um leitor de arquivos
    const reader = new FileReader();

    // Quando o leitor terminar de carregar o arquivo...
    reader.onload = (e) => {
      const data = e.target?.result; // Conteúdo do arquivo
      
      try {
        const workbook = XLSX.read(data, { type: 'array' });

        const worksheetName = workbook.SheetNames[0]; // Pega o nome da primeira aba
        
        const worksheet = workbook.Sheets[worksheetName]; // Pega os dados dessa aba
        
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const jsonData = rawData.map((item: any) => {
          const keys = Object.keys(item);
          const mapped: any = {};
        
          keys.forEach((key) => {
            const normalizedKey = key
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') // remove acentos
              .replace(/\s+/g, '') // remove todos os tipos de espaços
              .replace(/[^\w]/g, ''); // remove pontuações ou símbolos
        
            if (normalizedKey.includes('nome')) mapped.nome = item[key];
            if (normalizedKey.includes('matricula')) mapped.matricula = item[key];
          });
        
          return mapped;
        });

        console.log("JSON processado:", jsonData);

        if (!jsonData || jsonData.length === 0) {
          setError('O arquivo está vazio ou não contém dados.');
          setExcelData([]);
          return;
        }

        // Validação: verificar se cada item tem nome e matrícula
        const isValid = jsonData.every(
          (item: any) =>
            typeof item.nome === 'string' &&
            item.nome.trim() !== '' &&
            (typeof item.matricula === 'string' || typeof item.matricula === 'number') &&
            `${item.matricula}`.trim() !== ''
        );

        if (!isValid) {
          setError('Formato inválido. Certifique-se de que cada linha contenha "nome" e "matricula".');
          setExcelData([]);
          return;
        }

        setExcelData(jsonData as Aluno[]);
        setError(null);
        setSuccess('Arquivo carregado com sucesso!');

      } catch (err) {
        console.error(err)
        setError('Erro ao processar o arquivo Excel.');
        setExcelData([]);
      }

      // Remove os alertas após 5 segundos
      setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);

    };
      reader.readAsArrayBuffer(uploadedFile); // para .xlsx ou .xls
    
  }, []);

  // Tipos de arquivos que podem ser aceitos (apenas Excel)
  const acceptedFormats: Accept = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
  };

  // Hook do react-dropzone que lida com drag and drop e seleção de arquivos
  const {
    getInputProps, // Props que precisam ser aplicadas no <input>
    getRootProps, // Props que precisam ser aplicadas no container do dropzone
    open, // Função que abre o seletor de arquivos
    isDragActive, // Se o usuário está arrastando um arquivo sobre a área
  } = useDropzone({
    onDrop, // Função que será chamada quando um arquivo for solto
    accept: acceptedFormats, // Formatos aceitos
    multiple: false, // Só permite um arquivo por vez
    noClick: true, // Desativa clique automático 
    noKeyboard: true, // Desativa ativação via teclado
  });

  // Envia os dados para o backend
  const handleEnviarParaServidor = async () => {
    try {
      const response = await fetch('#', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alunos: excelData }),
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
    <div className="dropzone-container" {...getRootProps()}>
      <input {...getInputProps()} />
      <p className="dropzone-text">
        {isDragActive ? 'Solte o arquivo aqui...' : 'Arraste e solte o arquivo Excel aqui ou clique abaixo'}
      </p>

      <Button variant="contained" onClick={open}>
        Importar alunos (csv)
      </Button>

      {error && (
        <Alert severity="error" className="alert-box">
          <AlertTitle>Erro ao fazer upload</AlertTitle>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="alert-box">
          <AlertTitle>Upload feito com sucesso</AlertTitle>
          Os dados foram enviados corretamente ao servidor.
        </Alert>
      )}

      {excelData.length > 0 && (
        <div className="preview-box">
          <h3>Pré-visualização dos alunos:</h3>
          <ul>
            {excelData.map((aluno, index) => (
              <ul key={index}>
                {aluno.nome} — {aluno.matricula}
              </ul>
            ))}
          </ul>

          <Button
            variant="contained"
            color="success"
            onClick={handleEnviarParaServidor}
            sx={{ mt: 2 }}
          >
            Salvar
          </Button>
        </div>
      )}
    </div>
  );
}

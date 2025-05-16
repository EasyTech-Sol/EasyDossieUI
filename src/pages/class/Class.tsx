import { Box, SpeedDial, SpeedDialIcon, SpeedDialAction, } from "@mui/material"
import { Add, Article, } from "@mui/icons-material"
import { useState, useCallback } from "react"
import { useLocation } from "react-router-dom"
import AddStudentModal from '../auth/components/AddStudentModal';
import { useEffect } from "react"
import { apiService } from "../../services/easydossie.service";
import EditStudentModal from '../auth/components/EditStudentModal';
import ImportStudents from "../../components/importStudents/ImportStudents"
import { useDropzone } from 'react-dropzone';
import { handleExcelParse } from "../../utils/csvManaging";
import ClassAppBar from "./ClassAppBar";
import Students from "./Students";
import Search from "../../components/Search";
const drawerWidth = 240

const Class = () => {
  // ------------------ Estados principais ------------------
  const [searchTerm, setSearchTerm] = useState("");

  const { classId, title } = useLocation().state
  const [alunos, setAlunos] = useState<any[]>([]) // Lista de alunos da turma

  const [openAddStudentModal, setOpenAddStudentModal] = useState(false) // Controle do modal de adicionar aluno

  const [alunoEditando, setAlunoEditando] = useState<any | null>(null);
  // Armazena os dados extraídos do arquivo Excel
  const [excelData, setExcelData] = useState<Student[]>([]);
  // Controla a visibilidade do modal de pré-visualização
  const [open, setOpen] = useState(false);
  // Função para abrir o modal
  const handleOpenImportModal = () => setOpen(true);
  // Função para fechar o modal

  // ------------------ Funções de controle ------------------

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) handleExcelParse(file, handleOpenImportModal, setExcelData);
  }, []);

  const { getRootProps, getInputProps, open: openFileDialog } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const handleOpenAddStudentModal = () => setOpenAddStudentModal(true) // Abre o modal de aluno

  const handleCloseAddStudentModal = () => setOpenAddStudentModal(false) // Fecha o modal de aluno

  const handleOpenEditModal = (aluno: {
    id: number;
    nome: string;
    matricula: string;
    classId: number;
  }) => {
    setAlunoEditando(aluno);
  };

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ------------------ Lógica de dados ------------------


  const handleDeleteAluno = async (id: number, classId: number) => {
    try {
      await apiService.deleteStudent(classId, id);
      setAlunos(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Erro ao deletar aluno:", err);
    }
  };

  const getAlunos = useCallback(async (id: number) => {
    try {
      const response = await apiService.getClassStudents(id)
      setAlunos(response.data.students);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error)
    }
  }, [])

  useEffect(() => {
    getAlunos(classId)
  }, [getAlunos])


  const handleSaveEdit = useCallback(
    async (payload: {
      id: number;
      name: string;
      registration: string;

      classId: number;
    }) => {
      try {
        await apiService.editStudent(payload);
        await getAlunos(payload.classId);
        alert("Aluno editado com sucesso!");
      } catch (err: any) {
        console.error("Erro ao editar aluno:", err);
        alert(`Não foi possível editar o aluno: ${err.response?.data || err.message}`);
      }
    },
    [getAlunos]
  );

  return (
    <>
      {/* Main */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          position: "relative",
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <ClassAppBar />

        <Search value={searchTerm} onChange={setSearchTerm} />

        <Students
          alunos={alunosFiltrados}
          handleOpenEditModal={handleOpenEditModal}
          handleDeleteAluno={handleDeleteAluno}
        />

        <SpeedDial
          color="success"
          sx={{
            position: 'absolute',
            bottom: 32,
            right: 32,
            '& .MuiFab-primary': {
              backgroundColor: theme => theme.palette.success.main,
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkgreen',
              },
            },
          }}

          icon={<SpeedDialIcon />} ariaLabel={"Opções"}>
          <SpeedDialAction
            key={"add"}
            icon={<Add />}
            tooltipTitle={"Adicionar aluno"}
            onClick={() => {
              handleOpenAddStudentModal() // Abre o modal e aguarda o sucesso
            }} />
          <SpeedDialAction
            key={"import"}
            icon={< Article />}
            tooltipTitle={"Importar aluno (CSV)"}
            onClick={() => {
              openFileDialog()
            }} />
        </SpeedDial>

        <AddStudentModal
          open={openAddStudentModal}
          handleClose={handleCloseAddStudentModal}
          classId={classId}
          onSuccess={() => {
            // Fecha o modal e re-busca a lista de alunos
            handleCloseAddStudentModal()
            getAlunos(classId)
          }}
        />

        <ImportStudents
          classId={classId}
          registerDropzoneRoot={getRootProps}
          registerDropzoneInput={getInputProps}
          open={open}
          setOpen={setOpen}
          excelData={excelData}
          setExcelData={setExcelData}
          setStudents={setAlunos}
        />

        <EditStudentModal
          open={!!alunoEditando}
          handleClose={() => setAlunoEditando(null)}
          student={alunoEditando}
          onEdit={handleSaveEdit}
          classId={classId}
        />

      </Box>
    </>
  )
}

export default Class

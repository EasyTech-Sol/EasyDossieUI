import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from "@mui/material";
import { Add, Settings } from "@mui/icons-material";
import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";

import ClassAppBar from "./ClassAppBar";
import Search from "../../components/Search";
import Students from "./Students";
import Dossiers from "./Dossiers";

import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import ImportStudents from "../../components/importStudents/ImportStudents";

import { handleExcelParse } from "../../utils/csvManaging";
import { apiService } from "../../services/easydossie.service";
import { useTabsContext } from "../../contexts/TabContext";

const Class = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedSubTab } = useTabsContext();
  const { classId } = useLocation().state as { classId: number; title: string };

  const [alunos, setAlunos] = useState<any[]>([]);
  const [dossies, setDossies] = useState<any[]>([]);

  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [alunoEditando, setAlunoEditando] = useState<any | null>(null);

  const [excelData, setExcelData] = useState<any[]>([]);
  const [openImport, setOpenImport] = useState(false);
  const handleOpenImportModal = () => setOpenImport(true);

  const onDrop = useCallback((files: File[]) => {
    const file = files[0];
    if (file) handleExcelParse(file, handleOpenImportModal, setExcelData);
  }, []);
  const { getRootProps, getInputProps, open: openFileDialog } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  const [openAlunoDial, setOpenAlunoDial] = useState(false);
  const toggleAlunoDial = () => setOpenAlunoDial(o => !o);

  const actionStyle = {
    minWidth: "auto",
    width: "auto",
    px: 2,
    py: 1,
    borderRadius: "4px",
    boxShadow: 1,
  };

  const alunosFiltrados = alunos.filter(a =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const dossiesFiltrados = dossies.filter(d =>
  d.dossieTemplate.titulo
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
);


  const getAlunos = useCallback(async (id: number) => {
    try {
      const res = await apiService.getClassStudents(id);
      setAlunos(res.data.students);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getDossies = useCallback(async (id: number) => {
  try {
    const res = await apiService.getDossiersByClass(id);
    console.log("Dossiês recebidos:", res.data.dossiersClass);
    setDossies(res.data.dossiersClass || []);
  } catch (err) {
    console.error(err);
  }
}, []);

  useEffect(() => {
    if (selectedSubTab === "alunos") getAlunos(classId);
    else if (selectedSubTab === "dossies") getDossies(classId);
  }, [selectedSubTab, classId, getAlunos, getDossies]);

  const handleDeleteAluno = async (id: number) => {
    try {
      await apiService.deleteStudent(classId, id);
      setAlunos(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

 const handleDeleteDossier = async (dossierClassId: number) => {
  try {
    await apiService.deleteDossierFromClass(dossierClassId);
    setDossies(prev => prev.filter(d => d.id !== dossierClassId));
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir dossiê da turma.");
  }
};




  const handleSaveEdit = useCallback(async (payload: any) => {
    try {
      await apiService.editStudent(payload);
      await getAlunos(payload.classId);
      alert("Aluno editado com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert(`Erro: ${err.response?.data || err.message}`);
    }
  }, [getAlunos]);

  return (
    <>
      <ClassAppBar />

      <Search value={searchTerm} onChange={setSearchTerm} />

      {selectedSubTab === "alunos" && (
        <Students
          alunos={alunosFiltrados}
          handleOpenEditModal={setAlunoEditando}
          handleDeleteAluno={handleDeleteAluno}
        />
      )}

      {selectedSubTab === "dossies" && (
  <Dossiers dossiers={dossiesFiltrados} handleDeleteDossier={handleDeleteDossier} />
      )}

      {selectedSubTab === "alunos" && (
        <SpeedDial
          ariaLabel="Opções Alunos"
          sx={{
            position: "absolute",
            bottom: 32,
            right: 32,
            "& .MuiFab-primary": {
              backgroundColor: t => t.palette.success.main,
              color: "white",
              "&:hover": { backgroundColor: "darkgreen" },
            },
          }}
          open={openAlunoDial}
          FabProps={{ onClick: toggleAlunoDial }}
          icon={<SpeedDialIcon icon={<Add />} />}
        >
          <SpeedDialAction
            key="add"
            FabProps={{ sx: actionStyle }}
            icon={
              <Box component="span" sx={{ typography: "button", whiteSpace: "nowrap" }}>
                Adicionar aluno
              </Box>
            }
            tooltipTitle=""
            onClick={() => setOpenAddStudentModal(true)}
          />
          <SpeedDialAction
            key="import"
            FabProps={{ sx: actionStyle }}
            icon={
              <Box component="span" sx={{ typography: "button", whiteSpace: "nowrap" }}>
                Importar CSV
              </Box>
            }
            tooltipTitle=""
            onClick={() => openFileDialog()}
          />
        </SpeedDial>
      )}

      {selectedSubTab === "dossies" && (
        <SpeedDial
          ariaLabel="Opções Dossiês"
          sx={{
            position: "absolute",
            bottom: 32,
            right: 32,
            "& .MuiFab-primary": {
              backgroundColor: t => t.palette.success.main,
              color: "white",
              "&:hover": { backgroundColor: "darkgreen" },
            },
          }}
          icon={<SpeedDialIcon icon={<Settings />} />}
        >
          <SpeedDialAction
            key="relatorio"
            FabProps={{ sx: actionStyle }}
            icon={
              <Box component="span" sx={{ typography: "button", whiteSpace: "nowrap" }}>
                Acessar relatório
              </Box>
            }
            tooltipTitle=""
            onClick={() => alert("Acessando o relatório...")}
          />
          <SpeedDialAction
            key="dossie"
            FabProps={{ sx: actionStyle }}
            icon={
              <Box component="span" sx={{ typography: "button", whiteSpace: "nowrap" }}>
                Acessar dossiê
              </Box>
            }
            tooltipTitle=""
            onClick={() => alert("Acessando o dossiê...")}
          />
          <SpeedDialAction
            key="aplicar"
            FabProps={{ sx: actionStyle }}
            icon={
              <Box component="span" sx={{ typography: "button", whiteSpace: "nowrap" }}>
                Aplicar dossiê
              </Box>
            }
            tooltipTitle=""
            onClick={() => alert("Aplicando o dossiê...")}
          />
        </SpeedDial>
      )}

      <AddStudentModal
        open={openAddStudentModal}
        handleClose={() => setOpenAddStudentModal(false)}
        classId={classId}
        onSuccess={() => {
          setOpenAddStudentModal(false);
          getAlunos(classId);
        }}
      />
      <ImportStudents
        classId={classId}
        registerDropzoneRoot={getRootProps}
        registerDropzoneInput={getInputProps}
        open={openImport}
        setOpen={setOpenImport}
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
    </>
  );
};

export default Class;

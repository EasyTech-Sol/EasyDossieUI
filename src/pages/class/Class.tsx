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

  const [students, setStudents] = useState<Student[]>([]);
  const [dossiers, setDossiers] = useState<Dossier[]>([]);

  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

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

  const [openStudentDial, setOpenStudentDial] = useState(false);
  const toggleStudentDial = () => setOpenStudentDial(o => !o);

  const actionStyle = {
    minWidth: "auto",
    width: "auto",
    px: 2,
    py: 1,
    borderRadius: "4px",
    boxShadow: 1,
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDossiers = dossiers.filter(d =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudents = useCallback(async (id: number) => {
    try {
      const res = await apiService.getClassStudents(id);
      setStudents(res.data.students);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getDossiers = useCallback(async (id: number) => {
    try {
      const res = await apiService.getDossiersByClass(id);
      setDossiers(res.data.associatedDossiers.map((ad: any) => ad.dossierTemplate) || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (selectedSubTab === "students") getStudents(classId);
    else if (selectedSubTab === "dossiers") getDossiers(classId);
  }, [selectedSubTab, classId, getStudents, getDossiers]);

  const handleDeleteStudent = async (id: number) => {
    try {
      await apiService.deleteStudent(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDossier = async (dossierClassId: number) => {
    try {
      await apiService.deleteDossierFromClass(dossierClassId);
      setDossiers(prev => prev.filter(d => d.id !== dossierClassId));
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar dossiê");
    }
  };

  const handleSaveEditStudent = useCallback(async (payload: any) => {
    try {
      await apiService.editStudent(payload);
      await getStudents(payload.classId);
      alert("Estudante editado com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.response?.data || err.message}`);
    }
  }, [getStudents]);

  return (
    <>
      <ClassAppBar />
      <Search value={searchTerm} onChange={setSearchTerm} />

      {selectedSubTab === "students" && (
        <Students
          students={filteredStudents}
          handleOpenEditModal={setEditingStudent}
          handleDeleteStudent={handleDeleteStudent}
        />
      )}

      {selectedSubTab === "dossiers" && (
        <Dossiers
          dossiers={filteredDossiers}
          handleDeleteDossier={handleDeleteDossier}
        />
      )}

      {selectedSubTab === "students" && (
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
          open={openStudentDial}
          FabProps={{ onClick: toggleStudentDial }}
          icon={<SpeedDialIcon icon={<Add />} />}
        >
          <SpeedDialAction
            key="add"
            FabProps={{ sx: actionStyle }}
            icon={
              <Box component="span" sx={{ typography: "button", whiteSpace: "nowrap" }}>
                Adicionar Aluno
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
                Import CSV
              </Box>
            }
            tooltipTitle=""
            onClick={() => openFileDialog()}
          />
        </SpeedDial>
      )}

      {selectedSubTab === "dossiers" && (
        <SpeedDial
          ariaLabel="Opções Dossiês"
          sx={{
            position: "fixed",
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
            key="report"
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
            key="dossier"
            FabProps={{ sx: actionStyle }}
            icon={
              <Box component="span" sx={{ typography: "button", whiteSpace: "nowrap" }}>
                Acessar Dossiê
              </Box>
            }
            tooltipTitle=""
            onClick={() => alert("Acessando o dossiê...")}
          />
          <SpeedDialAction
            key="apply"
            FabProps={{ sx: actionStyle }}
            icon={
              <Box component="span" sx={{ typography: "button", whiteSpace: "nowrap" }}>
                Aplicar Dossiê
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
          getStudents(classId);
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
        setStudents={setStudents}
      />

      <EditStudentModal
        open={!!editingStudent}
        handleClose={() => setEditingStudent(null)}
        student={editingStudent}
        onEdit={handleSaveEditStudent}
        classId={classId}
      />
    </>
  );
};

export default Class;

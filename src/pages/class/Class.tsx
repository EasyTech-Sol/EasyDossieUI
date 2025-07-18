import {
  Box,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import AccountOptionsModal from "../home/components/AccountOptionsModal";  

import ClassAppBar from "./ClassAppBar";
import Search from "../../components/Search";
import Students from "./Students";
import Dossiers from "./Dossiers";
import { useNavigate } from "react-router-dom";

import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";
import ImportStudents from "../../components/importStudents/ImportStudents";

import { handleExcelParse } from "../../utils/csvManaging";
import { apiService } from "../../services/easydossie.service";
import { useTabsContext } from "../../contexts/TabContext";
import { useStudentContext } from "../../contexts/StudentContext";
import { useSnackbar } from "../../contexts/SnackBarContext";

const Class = () => {
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedSubTab } = useTabsContext();
  const classId = Number(useParams().classId)
  const { showMessage } = useSnackbar();
  const [actualClass, setActualClass] = useState<Class>()
  const { students, setStudents } = useStudentContext();
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const navigate = useNavigate();


  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [openImport, setOpenImport] = useState(false);
  const handleOpenImportModal = () => setOpenImport(true);

  const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/auth/sign-in");
  };

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (file) {
        handleExcelParse(file, handleOpenImportModal, setExcelData, showMessage);
      }
    },
    [showMessage]
  );

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
  const toggleStudentDial = () => setOpenStudentDial((o) => !o);

  const actionStyle = {
    minWidth: "auto",
    width: "auto",
    px: 2,
    py: 1,
    borderRadius: "4px",
    boxShadow: 1,
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDossiers = dossiers.filter((d) =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStudents = useCallback(
    async (id: number) => {
      try {
        const res = await apiService.getClassStudents(id);
        setStudents(res.data.students);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const getDossiers = useCallback(
    async (id: number) => {
      try {
        const res = await apiService.getDossiersByClass(id);
        const associated = (res.data.associatedDossiers || []).map((ad: any) => ad.dossierTemplate);
        setDossiers(associated);
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const getActualClass = useCallback(
    async (id: number) => {
      try {
        const res = await apiService.getClassById(id);
        setActualClass(res.data.class_)
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  useEffect(() => {
    getActualClass(classId)
    if (selectedSubTab === "students") getStudents(classId);
    else if (selectedSubTab === "dossiers") getDossiers(classId);
  }, [selectedSubTab, classId, getStudents, getDossiers]);

  const handleDeleteStudent = async (id: number) => {
    try {
      await apiService.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      showMessage("Aluno excluído com sucesso!", "success");
    } catch (err: any) {
      console.error("Erro ao excluir aluno:", err);
      const errorMessage =
        err.response?.data?.message || err.response?.data || err.message ||
        "Erro ao excluir aluno.";
      showMessage(String(errorMessage), "error");
    }
  };

  const handleDeleteDossier = async ({classId, dossierId}: ClassDossier) => {
    try {
      await apiService.deleteDossierFromClass({classId, dossierId});
      setDossiers((prev) =>
        prev.filter((d) => d.id !== dossierId)
      );
      showMessage("Dossiê desassociado com sucesso!", "success");
    } catch (err: any) {
      let errorMessage = "Erro ao desassociar dossiê.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (typeof err.response?.data === "string") {
        errorMessage = err.response.data;
      } else if (err.message) {
        errorMessage = err.message;
      }
      showMessage(errorMessage, "error");
    }
  };

  const handleSaveEditStudent = useCallback(
    async (payload: any) => {
      try {
        await apiService.editStudent(payload);
        await getStudents(payload.classId);
        showMessage("Estudante editado com sucesso!", "success");
      } catch (err: any) {
        console.error(err);
        const errorMessage =
          err.response?.data?.message || err.response?.data || err.message ||
          "Ocorreu um erro ao editar o estudante.";
        showMessage(String(errorMessage), "error");
      }
    },
    [getStudents, showMessage]
  );

  return (
    <>
       <ClassAppBar
        classTitle={actualClass ? actualClass.title : ""}
        onAccountClick={() => setAccountModalOpen(true)}
      />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 1, width: "100%" }}>
        <Box sx={{ width: "100%", maxWidth: "1000px", px: 2 }}>
          <Search value={searchTerm} onChange={setSearchTerm} />
        </Box>
      </Box>

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
          setDossiers={setDossiers}
          handleDeleteDossier={handleDeleteDossier}
        />
      )}

      {selectedSubTab === "students" && (
        <SpeedDial
          ariaLabel="Opções Alunos"
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            "& .MuiFab-primary": {
              backgroundColor: (t) => t.palette.success.main,
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
    <AccountOptionsModal
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onDelete={async () => {
          try {
            await apiService.deleteTeacher();
            showMessage("Perfil excluído com sucesso!", "success");
            setAccountModalOpen(false);
            handleLogout(); 
          } catch (err: any) {
            const msg =
              err.response?.data?.message ||
              err.response?.data?.error ||
              err.message ||
              "Erro ao excluir o perfil.";
            showMessage(msg, "error");
          }
        }}
      />
    </>
  );
};

export default Class;

import { AppBar, Box, Tab, Tabs, Divider, Drawer, IconButton, InputBase, List, ListItemButton, ListItemIcon, ListItemText, Paper, Toolbar, Fab, useTheme, useMediaQuery, MenuItem, Menu, } from "@mui/material"
import { Add, Description, ExitToApp, Info, Person, School, Search, } from "@mui/icons-material"
import { useState, useCallback } from "react"
import Logo from "../assets/logo.svg"
import { useNavigate, useParams } from "react-router-dom"
import AddStudentModal from './auth/components/AddStudentModal';
import SettingsIcon from "@mui/icons-material/Settings"
import { Edit, Delete } from "@mui/icons-material";
import { useEffect } from "react"
import { apiService } from "../services/easydossie.service"
import EditStudentModal from './auth/components/EditStudentModal';
import ImportStudents from "../components/importStudents/ImportStudents"
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const drawerWidth = 240



const DrawerContent = ({ selectedTab, onLogout, }: { selectedTab: "turmas" | "dossies", onLogout: () => void }) => (
  <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <Box>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <img src={Logo} alt="Logo" style={{ height: 40 }} />
      </Box>
      <List>
        <ListItemButton selected={selectedTab === "turmas"}>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary="Turmas" />
        </ListItemButton>
        <ListItemButton disabled selected={selectedTab === "dossies"}>
          <ListItemIcon>
            <Description />
          </ListItemIcon>
          <ListItemText primary="Dossiês" />
        </ListItemButton>
      </List>
    </Box>
    <Box sx={{ mt: "auto" }}>
      <List>
        <ListItemButton>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary="Sobre" />
        </ListItemButton>
        <ListItemButton onClick={onLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Sair" />
        </ListItemButton>
      </List>
    </Box>
  </Box>
)








const Class = () => {
  // ------------------ Estados principais ------------------

  const classId = Number(useParams().classId)
  const [alunos, setAlunos] = useState<any[]>([]) // Lista de alunos da turma

  const [selectedTab] = useState<"turmas" | "dossies">("turmas") // Aba principal fixa em "turmas"
  const [selectedSubTab, setSelectedSubTab] = useState<"dossies" | "alunos">("alunos") // Subaba ativa ("alunos" ou "dossies")

  const [openAddStudentModal, setOpenAddStudentModal] = useState(false) // Controle do modal de adicionar aluno

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null) // Âncora para menu de configurações
  const openSettingsMenu = Boolean(anchorEl) // Abre ou fecha o menu de configurações

  const [mobileOpen, setMobileOpen] = useState(false) // Controle do menu lateral em mobile

  const [alunoEditando, setAlunoEditando] = useState<any | null>(null);
  // Armazena os dados extraídos do arquivo Excel
  const [excelData, setExcelData] = useState<Student[]>([]);
  // Controla a visibilidade do modal de pré-visualização
  const [open, setOpen] = useState(false);
  // Função para abrir o modal
  const handleOpenImportModal = () => setOpen(true);
  // Função para fechar o modal

  // ------------------ Hooks ------------------

  const theme = useTheme() // Tema do Material UI
  const isMobile = useMediaQuery(theme.breakpoints.down("md")) // Detecta se é mobile
  const navigate = useNavigate() // Hook de navegação

  // ------------------ Funções de controle ------------------
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

      return { name, registration: String(registration) };
    });

    // Verifica se todos os registros são válidos
    const isValid = jsonData.every(
      (item) =>
        typeof item.name === 'string' &&
        item.name.trim() !== '' &&
        (typeof item.registration === 'string' || typeof item.registration === 'number') &&
        `${item.registration}`.trim() !== ''
    );

    if (!isValid) {
      alert('Formato inválido. Certifique-se de que cada linha contenha "nome" e "matricula".');
      setExcelData([]);
      return;
    }

    setExcelData(jsonData);
    alert('Arquivo carregado com sucesso!');
    handleOpenImportModal();
  };


  // Lógica para processar os arquivos CSV ou Excel
  const handleExcelParse = (file: File) => {
    const fileName = file.name.toLowerCase();

    // Se for CSV
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
            alert('Erro ao processar o arquivo CSV.');
          },
        });
      };
      reader.readAsText(file, 'utf-8');
      // Se for Excel
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
          alert('Erro ao processar o arquivo Excel.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Formato de arquivo não suportado.');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) handleExcelParse(file);
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


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen) // Alterna o menu lateral (drawer)
  }

  const handleOpenAddStudentModal = () => setOpenAddStudentModal(true) // Abre o modal de aluno

  const handleCloseAddStudentModal = () => setOpenAddStudentModal(false) // Fecha o modal de aluno

  const handleLogout = () => {
    localStorage.removeItem("token") // Remove token de autenticação
    navigate("/auth/sign-in") // Redireciona para tela de login
  }

  const handleOpenSettings = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget) // Define o elemento que abriu o menu
  }

  const handleCloseSettings = () => {
    setAnchorEl(null) // Fecha o menu de configurações
  }

  const handleSubTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedSubTab(newValue as "dossies" | "alunos") // Altera subaba ativa
  }

  const handleOpenEditModal = (aluno: {
    id: number;
    nome: string;
    matricula: string;
    classId: number;
  }) => {
    setAlunoEditando(aluno);
  };

  // ------------------ Lógica de dados ------------------



  const handleDeleteAluno = async (id: number, classId: number) => {
    try {
      await apiService.deleteStudent(classId, id);
      console.log("Aluno deletado com sucesso");
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

  console.log(Array.isArray(alunos));

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Drawer */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
        >
          <DrawerContent selectedTab={selectedTab} onLogout={handleLogout} />
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          }}
        >
          <DrawerContent selectedTab={selectedTab} onLogout={handleLogout} />
        </Drawer>
      )}

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
        {/* Top AppBar */}
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar
            sx={{
              flexDirection: "column",
              alignItems: "stretch",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton>
                <Person />
              </IconButton>
            </Box>

            <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}

            {/* Centralizar Tabs e manter ícone à direita */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Tabs
                value={selectedSubTab}
                onChange={handleSubTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="tabs de conteúdo"
                TabIndicatorProps={{ sx: { height: 3 } }} // opcional: deixa o indicador mais grosso
              >
                <Tab
                  value="dossies"
                  label="Dossiês"
                  sx={{ fontSize: "1rem", fontWeight: 500, mx: 20 }}

                />
                <Tab
                  value="alunos"
                  label="Alunos"
                  sx={{ fontSize: "1rem", fontWeight: 500, mx: 20 }}
                />
              </Tabs>
            </Box>



            <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}

            <Box sx={{ display: "flex", justifyContent: "right", mt: 1 }}>
              <Paper
                component="form"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  maxWidth: 400,
                  px: 2,
                  py: 0.5,
                  borderRadius: "999px", // deixa super arredondado
                  boxShadow: 1, // sombra leve
                }}
              >
                <Search color="action" />
                <InputBase
                  placeholder="Buscar alunos..."
                  inputProps={{ "aria-label": "buscar alunos" }}
                  sx={{ ml: 1, flex: 1 }}
                />
              </Paper>
            </Box>



          </Toolbar>

        </AppBar>

        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          {alunos.map((aluno) => (
            <Paper
              key={aluno.id}
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: 2,
              }}
            >
              <Box>
                <Box sx={{ fontSize: 18 }}>{aluno.nome}</Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton sx={{ color: "black" }} onClick={() => handleOpenEditModal({
                  id: aluno.id, nome: aluno.nome, matricula: aluno.matricula, classId, // ou de onde você tiver o ID da turma
                })}>
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton sx={{ color: "black" }} onClick={() => handleDeleteAluno(aluno.id, classId)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>


        <Fab
          color="success"
          sx={{ position: "absolute", bottom: 32, right: 32 }}
          onClick={handleOpenSettings}
        >
          <SettingsIcon />
        </Fab>

        <Menu
          anchorEl={anchorEl}
          open={openSettingsMenu}
          onClose={handleCloseSettings}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={() => {
              handleCloseSettings() // Fecha o menu antes de abrir o modal
              handleOpenAddStudentModal() // Abre o modal e aguarda o sucesso
            }}
          >
            + Adicionar aluno
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleCloseSettings() // Fecha o menu antes de abrir o modal
              openFileDialog()
            }}
          >
            Importar Alunos (CSV)
          </MenuItem>
        </Menu>

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
          handleExcelParse={handleExcelParse}
          open={open}
          setOpen={setOpen}
          excelData={excelData}
          setExcelData={setExcelData}
        />

        <EditStudentModal
          open={!!alunoEditando}
          handleClose={() => setAlunoEditando(null)}
          student={alunoEditando}
          onEdit={handleSaveEdit}
          classId={classId}
        />

      </Box>
    </Box>
  )
}

export default Class

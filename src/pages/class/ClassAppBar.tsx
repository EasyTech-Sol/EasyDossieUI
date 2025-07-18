import { NavigateNext, Person } from "@mui/icons-material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTabsContext } from "../../contexts/TabContext";
import CustomLink from "./CustomLink";

interface ClassAppBarProps {
  classTitle: string;
  onAccountClick: () => void;
}

const ClassAppBar = ({ classTitle, onAccountClick }: ClassAppBarProps) => {
  const { selectedSubTab, setSelectedSubTab } = useTabsContext();
  const navigate = useNavigate();

  // Função para truncar o texto
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleSubTabChange = (
    _event: React.SyntheticEvent,
    newValue: string
  ) => {
    setSelectedSubTab(newValue as "dossiers" | "students"); // Altera subaba ativa
  };

  const breadcrumbs = [
    <CustomLink to="/home">Turmas</CustomLink>,
    <Tooltip key="class" title={classTitle}>
      {/* */}
      <CustomLink>{truncateText(classTitle, 35)}</CustomLink>
    </Tooltip>,
  ];

  return (
    <>
      <AppBar position="relative" color="transparent" elevation={0}>
        <Toolbar
          sx={{
            flexDirection: "column",
            alignItems: "stretch",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "4rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
                height: "60%",
              }}
            >
              <Button
                onClick={() => navigate("/home")}
                sx={{ textTransform: "none" }}
                startIcon={<ArrowBackIosNewIcon sx={{ color: "#37474f" }} />}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ ml: 1, color: "#37474f" }}
                >
                  Voltar
                </Typography>
              </Button>

              <Divider orientation="vertical" variant="middle" />

              <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
              >
                {breadcrumbs}
              </Breadcrumbs>
            </Box>

            <IconButton size="large" onClick={onAccountClick}>
              <Person />
            </IconButton>
          </Box>
          <Divider /> {/* Espaçamento vertical acima e abaixo */}
          {/* Centralizar Tabs e manter ícone à direita */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Tabs
              value={selectedSubTab}
              onChange={handleSubTabChange}
              textColor="primary"
              indicatorColor="primary"
              aria-label="tabs de conteúdo"
              sx={{
                width: "100%",
              }}
              TabIndicatorProps={{
                sx: {
                  height: 3,
                },
              }}
            >
              <Tab
                value="dossiers"
                label="Dossiês"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  flexBasis: "50%",
                  maxWidth: "unset", 
                }}
              />
              <Tab
                value="students"
                label="Alunos"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  flexBasis: "50%",
                  maxWidth: "unset", 
                }}
              />
            </Tabs>
          </Box>
          <Divider sx={{ my: 0.5 }} />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default ClassAppBar
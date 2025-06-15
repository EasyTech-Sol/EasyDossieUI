import { NavigateNext, Person } from '@mui/icons-material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { AppBar, Box, Breadcrumbs, Button, Divider, IconButton, Toolbar, Typography, Tooltip } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/easydossie.service';
import CustomLink from '../class/CustomLink';

const EvaluationAppBar = () => {
    const classId = Number(useParams().classId);
    const dossierId = Number(useParams().dossierId);
    const navigate = useNavigate();
    const [actualDossier, setActualDossier] = useState<Dossier>();
    const [actualClass, setActualClass] = useState<Class>();

    const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    const breadcrumbs = [
        <CustomLink to="/home">Turmas</CustomLink>,
        actualClass ? (
            <Tooltip title={actualClass.title} key="class">
                <CustomLink to={`/class/${classId}`}>
                    {truncateText(actualClass.title, 35)}
                </CustomLink>
            </Tooltip>
        ) : (
            ''
        ),
        actualDossier ? (
            <Tooltip title={actualDossier.title} key="dossier">
                <Typography sx={{ color: '#37474f', fontWeight: 500 }}>
                    {truncateText(actualDossier.title, 35)}
                </Typography>
            </Tooltip>
        ) : (
            ''
        ),
    ];


    const getActualClass = useCallback(
        async (id: number) => {
            try {
                const res = await apiService.getClassById(id);
                setActualClass(res.data.class_);
            } catch (err) {
                console.error(err);
            }
        },
        []
    );

    const getActualDossier = useCallback(
        async (id: number) => {
            try {
                const res = await apiService.getDossierById(id);
                setActualDossier(res.data.dossier);
            } catch (err) {
                console.error(err);
            }
        },
        []
    );

    useEffect(() => {
        getActualDossier(dossierId);
        getActualClass(classId);
    }, [dossierId, classId]);

    return (
        <AppBar position="relative" color="transparent" elevation={0}>
            <Toolbar sx={{ flexDirection: 'column', alignItems: 'stretch', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: 1,
                            height: '60%',
                        }}
                    >
                        <Button
                            onClick={() => navigate(`/class/${classId}`)}
                            sx={{ textTransform: 'none' }}
                            startIcon={<ArrowBackIosNewIcon sx={{ color: '#37474f' }} />}
                        >
                            <Typography variant="subtitle1" sx={{ ml: 1, color: '#37474f' }}>
                                Voltar
                            </Typography>
                        </Button>

                        <Divider orientation="vertical" variant="fullWidth" />

                        <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
                            {breadcrumbs}
                        </Breadcrumbs>
                    </Box>

                    <IconButton size="large">
                        <Person />
                    </IconButton>
                </Box>

                <Divider />
            </Toolbar>
        </AppBar>
    );
};

export default EvaluationAppBar;

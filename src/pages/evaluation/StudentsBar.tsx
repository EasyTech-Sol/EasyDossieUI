import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid } from '@mui/material';
import StudentsCarousel from './StudentsCarousel';
import { apiService } from "../../services/easydossie.service"
import { useState } from 'react';

interface StudentsBarProps {
    canExport: boolean;
    classId: number | string;
    dossierId: number | string;
}

const StudentsBar = ({ canExport, classId, dossierId }: StudentsBarProps) => {
    const [openDialog, setOpenDialog] = useState(false)

    // Função para chamar a API de finalizar dossiê
    const handleFinalize = async () => {
        try {
            const response = await apiService.finalizeStudentDossier(classId, dossierId);
            setOpenDialog(true)
            alert("Dossiê finalizado com sucesso!");
        } catch (error) {
            alert("Ocorreu um erro ao finalizar o dossiê.");
        }
    };

    const handleClose = () => setOpenDialog(false);
    const handleConfirm = () => {
        console.log('Ação confirmada!');
        handleClose();
    };

    return (
        <>
            <Grid container width={"100%"}>
                <Grid size={8} display="flex" alignItems="center" justifyContent="center">
                    <StudentsCarousel />
                </Grid>
                <Grid paddingRight={5} size={4} display="flex" alignItems="center" justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="success"
                        size='large'
                        disabled={!canExport}
                        onClick={handleFinalize} // Chama a função handleFinalize ao clicar
                    >
                        FINALIZAR
                    </Button>
                </Grid>
            </Grid>
            <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}

            <Dialog
                open={openDialog}
                onClose={handleClose}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirmar exportação</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Tem certeza que deseja finalizar e exportar os dossiês?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='success'>Cancelar</Button>
                    <Button onClick={handleConfirm} color="success" variant="contained" autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default StudentsBar;

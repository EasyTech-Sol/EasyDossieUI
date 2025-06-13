import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid } from '@mui/material';
import StudentsCarousel from './StudentsCarousel';
import { useRef, useState } from 'react';
import { useReactToPrint } from "react-to-print"
import { useSnackbar } from '../../contexts/SnackBarContext';
import { useStudentContext } from '../../contexts/StudentContext';
import { useEvaluationContext } from '../../contexts/EvaluationContext';
import DossierPDF from './DossierPDF';

interface StudentsBarProps {
    canExport: boolean;
}

const StudentsBar = ({ canExport }: StudentsBarProps) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [loading, setLoading] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    const { showMessage } = useSnackbar()
    const { students } = useStudentContext()
    const { dossierTemplate, evaluations, hasEvaluationUpdated } = useEvaluationContext()

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        pageStyle: `
            @page {
                size: A4;
                margin: 20mm;
            }
        `,
        onAfterPrint: () => {
            showMessage("PDF gerado com sucesso!", "success");
            setOpenDialog(false);
        },
        onPrintError: () => {
            showMessage("Erro ao gerar PDF", "error");
            setOpenDialog(false);
        }
    });
    // Função para chamar a API de finalizar dossiê
    const handleFinalize = async () => {
        setOpenDialog(true)
        setLoading(true)
    };

    const handleClose = () => setOpenDialog(false);
    const handleConfirm = () => {
        handlePrint()
        setLoading(false)
        handleClose()
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
                        disabled={!canExport || hasEvaluationUpdated}
                        loading={loading}
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

            <div style={{ display: 'none' }}>
                <div ref={contentRef}>
                    {students.map((student) => {

                        const studentEvaluation = evaluations.find(
                            (ev) => ev.studentId === student.id
                        );
                        if (!studentEvaluation || !dossierTemplate) return null;

                        const formattedEvaluation = {
                            studentId: studentEvaluation.studentId,
                            evaluation: studentEvaluation.evaluation || [],
                            studentName: studentEvaluation.studentName,
                            grade: studentEvaluation.grade
                        };

                        return (
                            <DossierPDF
                                key={student.id}
                                dossier={dossierTemplate}
                                student={student}
                                evaluation={formattedEvaluation}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default StudentsBar;

import { Button, Divider, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import StudentsCarousel from './StudentsCarousel';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState } from 'react';
import { useEvaluationContext } from '../../contexts/EvaluationContext';
import { useStudentContext } from '../../contexts/StudentContext';
import DossiePDF from '../../components/DossiePDF';
import { useSnackbar } from '../../contexts/SnackBarContext';
import { apiService } from '../../services/easydossie.service';
import { useParams } from 'react-router-dom';

interface StudentsBarProps {
    canExport: boolean;
    classId: number | string;
    dossierId: number | string;
}

export default function StudentsBar({ canExport, classId, dossierId }: StudentsBarProps) {
    const { evaluations, dossierTemplate, setEvaluations } = useEvaluationContext();
    const { students } = useStudentContext();
    const { showMessage } = useSnackbar();
    const contentRef = useRef<HTMLDivElement>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const reloadEvaluations = async () => {
        try {
            const result = await apiService.getClassDossierEvaluation(classId, dossierId);
            const backendResponseData = result.data;
            const studentDossiers = backendResponseData.dossiersStudent;
            setEvaluations(studentDossiers);
        } catch (error) {
            console.error("Erro ao recarregar avaliações:", error);
            showMessage("Erro ao recarregar avaliações", "error");
        }
    };

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

    const handleFinalize = async () => {
        if (!canExport) {
            showMessage("Nem todos os alunos foram avaliados", "error");
            return;
        }

        try {
            showMessage("Calculando notas finais...", "info");
            await apiService.finalizeStudentDossier(classId, dossierId);
            showMessage("Notas calculadas com sucesso!", "success");
            await reloadEvaluations();
            setOpenDialog(true);
        } catch (error) {
            showMessage("Erro ao calcular notas finais", "error");
            console.error("Erro ao finalizar dossiê:", error);
        }
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
                        size='large' 
                        disabled={!canExport}
                        onClick={handleFinalize}
                    >
                        FINALIZAR
                    </Button>
                </Grid>
            </Grid>
            <Divider sx={{ my: 0.5 }} />

            {/* Modal de confirmação */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Gerar PDF</DialogTitle>
                <DialogContent>
                    Deseja gerar o PDF com as avaliações?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Não</Button>
                    <Button onClick={handlePrint} variant="contained">Sim</Button>
                </DialogActions>
            </Dialog>

            {/* Container oculto para o PDF */}
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
                            grade: studentEvaluation.grade
                        };

                        return (
                            <DossiePDF
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

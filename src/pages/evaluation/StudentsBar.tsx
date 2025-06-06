import { Button, Divider, Grid } from '@mui/material';
import StudentsCarousel from './StudentsCarousel';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { useEvaluationContext } from '../../contexts/EvaluationContext';
import { useStudentContext } from '../../contexts/StudentContext';
import DossiePDF from '../../components/DossiePDF';
import { useSnackbar } from '../../contexts/SnackBarContext';

interface StudentsBarProps {
    canExport: boolean;
    classId: number | string;
    dossierId: number | string;
}

const StudentsBar = ({ canExport, classId, dossierId }: StudentsBarProps) => {
    const { evaluations, dossierTemplate } = useEvaluationContext();
    const { students } = useStudentContext();
    const { showMessage } = useSnackbar();
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        pageStyle: `
            @page {
                size: A4;
                margin: 20mm;
            }
        `,
        onBeforeGetContent: () => {
            showMessage("Gerando PDF...", "info");
        },
        onAfterPrint: () => {
            showMessage("PDF gerado com sucesso!", "success");
        },
        onPrintError: () => {
            showMessage("Erro ao gerar PDF", "error");
        }
    });

    const handleFinalize = () => {
        if (!canExport) {
            showMessage("Nem todos os alunos foram avaliados", "error");
            return;
        }
        handlePrint();
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
                        onClick={handleFinalize}
                    >
                        FINALIZAR
                    </Button>
                </Grid>
            </Grid>
            <Divider sx={{ my: 0.5 }} />

            {/* Container oculto para o PDF */}
            <div style={{ display: 'none' }}>
                <div ref={contentRef}>
                    {students.map((student) => {
                        const studentEvaluation = evaluations.find(
                            (ev) => ev.studentId === student.id
                        );
                        if (!studentEvaluation || !dossierTemplate) return null;

                        return (
                            <DossiePDF
                                key={student.id}
                                dossier={dossierTemplate}
                                student={student}
                                evaluation={studentEvaluation}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default StudentsBar;

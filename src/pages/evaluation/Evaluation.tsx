import { Box, Typography, Paper, Grid, Zoom } from "@mui/material"
import EvaluationAppBar from "./EvaluationAppBar"
import Fab from '@mui/material/Fab';
import SaveIcon from '@mui/icons-material/Save';
import StudentsBar from "./StudentsBar"
import StudentsScores from "./StudentsScores"
import { useEffect, useState } from "react"
import { apiService } from "../../services/easydossie.service"
import { useParams } from "react-router-dom"
import { useEvaluationContext } from "../../contexts/EvaluationContext"
import { useStudentContext } from "../../contexts/StudentContext"
import { isAxiosError } from "axios";
import CategoryView from "./CategoryView";
import { useSnackbar } from "../../contexts/SnackBarContext"; 


const Evaluation = () => {
    const { classId, dossierId } = useParams()
    const { setEvaluations, setDossierTemplate,
        dossierTemplate, evaluations,
        hasEvaluationUpdated, setHasEvaluationUpdated } = useEvaluationContext()
    const { selectedStudentIndex, students } = useStudentContext()
    const [canExport, setCanExport] = useState(false)
    const { showMessage } = useSnackbar();

    useEffect(() => {
        const initializeAndFetchEvaluations = async () => {
            if (!classId || !dossierId) {
                setDossierTemplate(undefined);
                setEvaluations([]);
                return;
            }

            try {
                //copia pra cada estudante
                await apiService.createStudentDossiers(classId, dossierId);

                //buscando tudo:template dos estudantes (preenchidos ou não)
                const result = await apiService.getClassDossierEvaluation(classId, dossierId);

                //result.data é um objeto que tem dossiersStudent
                const backendResponseData = result.data;
                const studentDossiers = backendResponseData.dossiersStudent; // Pega o array da propriedade correta

                //VALIDAR
                if (!Array.isArray(studentDossiers)) {
                    console.error("A propriedade 'dossiersStudent' na resposta do backend não é um array ou está ausente. Resposta completa:", backendResponseData);
                    throw new Error("A propriedade 'dossiersStudent' na resposta do backend não é um array ou está ausente.");
                }

                let receivedDossierTemplate = null;
                if (studentDossiers.length > 0) {
                    const firstStudentDossier = studentDossiers[0];
                    if (firstStudentDossier && firstStudentDossier.classDossier && firstStudentDossier.classDossier.dossierTemplate) {
                        receivedDossierTemplate = firstStudentDossier.classDossier.dossierTemplate;
                    } else {
                        console.error("Estrutura inesperada em firstStudentDossier, não foi possível encontrar dossierTemplate:", firstStudentDossier);
                        showMessage("Erro ao identificar o dossiê. Verifique a estrutura de dados.", "error");
                    }
                } else if (backendResponseData.dossierTemplate) {
                    // Esta parte ainda assume que o backend PODE enviar o template na raiz
                    // se a lista studentDossiers for vazia.
                    receivedDossierTemplate = backendResponseData.dossierTemplate;
                }

                if (receivedDossierTemplate) {
                    setDossierTemplate(receivedDossierTemplate);
                } else {
                    console.error("Não foi possível determinar o dossierTemplate.");
                    setDossierTemplate(undefined);
                    showMessage("A estrutura do dossiê não foi encontrada. Verifique se ele está configurado corretamente.", "warning");
                    setEvaluations([]);
                    return;
                }

                // Formata as avaliações para o estado do frontend
                const formattedEvaluations: Evaluation[] = studentDossiers.map((sd: any) => {
                    // logica de formatação e safety checks
                    if (!sd || typeof sd.studentId === 'undefined') {
                        console.error("Objeto 'sd' inválido ou sem studentId:", sd);
                        showMessage("Um dos alunos possui dados incompletos e pode não aparecer corretamente.", "warning");
                        return { studentId: 'ID_ALUNO_INVALIDO', studentName: sd.studentName, evaluation: [] };
                    }
                    if (!Array.isArray(sd.criterionEvaluation)) {
                        console.warn("'sd.criterionEvaluation' não é um array para o studentId:", sd.studentId, sd);
                        showMessage(`O aluno ${sd.studentName} ainda não possui critérios de avaliação definidos.`, "info");
                        return { studentId: sd.studentId, studentName: sd.studentName, evaluation: [] };
                    }
                    return {
                        studentId: sd.studentId,
                        studentName: sd.studentName,
                        evaluation: sd.criterionEvaluation.map((ce: any) => {
                            if (!ce || typeof ce.criterionId === 'undefined' || typeof ce.concept === 'undefined') {
                                console.error("Objeto 'ce' inválido ou faltando criterionId/concept:", ce);
                                showMessage("Alguns critérios de avaliação estão com dados incompletos.", "warning");
                                return { criterionId: -1, concept: 'ERRO' };
                            }
                            return {
                                criterionId: ce.criterionId,
                                concept: ce.concept
                            };
                        })
                    };
                });
                setEvaluations(formattedEvaluations);

            } catch (error) {
                console.error("Erro CRÍTICO no useEffect ao inicializar/buscar dados:", error);
                let errorMessage = "Não foi possível carregar os dados da avaliação. Verifique o console para detalhes.";
                if (isAxiosError(error))
                    if (error.response && error.response.data && error.response.data.message) {
                        errorMessage = `Erro do servidor: ${error.response.data.message}`;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }
                showMessage(`Erro ao carregar avaliações: ${errorMessage}`, "error");
                setDossierTemplate(undefined);
                setEvaluations([]);
            }
        };

        initializeAndFetchEvaluations();

    }, [classId, dossierId, setDossierTemplate, setEvaluations]);


    const handleSaveAll = async () => {
        //existe um aluno selecionado?
        if (selectedStudentIndex === null || selectedStudentIndex === undefined || !students[selectedStudentIndex]) {
            console.error("Nenhum aluno selecionado para salvar.");
            showMessage("Por favor, selecione um aluno antes de salvar.", "warning"); 
            return;
        }

        const studentId = students[selectedStudentIndex].id;

        //pega todas as avaliacoes do aluno do estado local
        const studentEvaluationData = evaluations.find(ev => ev.studentId === studentId);

        //veerifica se existe algo para salvar
        if (!studentEvaluationData || studentEvaluationData.evaluation.length === 0) {
            console.warn("Nenhuma avaliação para salvar para este aluno.");
            showMessage("Nenhuma avaliação foi feita para este aluno.", "info");
            return;
        }

        //envia todas as avaliacoes para o backend
        try {

            await apiService.saveEvaluation(classId!, dossierId!, studentId, studentEvaluationData.evaluation);
            setHasEvaluationUpdated(false)
            showMessage("Avaliações salvas com sucesso!", "success");

        } catch (error) {
            let errorMsg = "Ocorreu um erro ao salvar as avaliações. Tente novamente.";
            if (isAxiosError(error)) {
                if (error.response?.data?.message) {
                    errorMsg = error.response.data.message;
                }
            }
            showMessage(errorMsg, "error");
        }
    };

    const handleConceptChange = (criterionId: number, concept: string) => { // Removido o 'async'
        if (selectedStudentIndex === null || selectedStudentIndex === undefined || !students[selectedStudentIndex]) return;

        const studentId = students[selectedStudentIndex].id;

        //atualiza o estado local primeiro 
        const updatedEvaluations = evaluations.map(ev => {
            if (ev.studentId === studentId) {
                const existingEvaluation = ev.evaluation.find(e => e.criterionId === criterionId);
                if (existingEvaluation) {
                    return {
                        ...ev,
                        evaluation: ev.evaluation.map(e =>
                            e.criterionId === criterionId ? { ...e, concept } : e
                        )
                    };
                } else {
                    return {
                        ...ev,
                        evaluation: [...ev.evaluation, { criterionId, concept }]
                    };
                }
            }
            return ev;
        });

        setEvaluations(updatedEvaluations);
        setHasEvaluationUpdated(true)
    };

    const getStudentEvaluation = (criterionId: number) => {
        if (selectedStudentIndex === null || selectedStudentIndex === undefined || !students[selectedStudentIndex]) return '';
        const studentId = students[selectedStudentIndex].id;
        const studentEvaluation = evaluations.find(ev => ev.studentId === studentId);
        return studentEvaluation?.evaluation.find(e => e.criterionId === criterionId)?.concept || '';
    };

    return (
        <Box position={"relative"} width={"100%"}>
            <EvaluationAppBar />
            <StudentsBar canExport={canExport} classId={classId!} dossierId={dossierId!} /> {/* Passando classId e dossierId */}
            <Grid container>
                <Grid size={8} sx={{ maxHeight: '60vh', overflow: 'auto' }}>
                    {dossierTemplate && (
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h4" gutterBottom textAlign="center">
                                {dossierTemplate.title}
                            </Typography>
                            <Typography variant="h5" textAlign="center">
                                Área: {dossierTemplate.evaluationArea}
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {dossierTemplate.description}
                            </Typography>

                            {dossierTemplate.categories.map(category => (
                                <CategoryView
                                    key={category.id}
                                    category={category}
                                    concepts={dossierTemplate.concepts.split(',')}
                                    getStudentEvaluation={getStudentEvaluation}
                                    onConceptChange={handleConceptChange}
                                />
                            ))}
                        </Paper>
                    )}
                </Grid>

                <Grid size={4} sx={{ p: 1 }}>
                    <StudentsScores setCanExport={setCanExport} />
                </Grid>
            </Grid>

            <Zoom in={hasEvaluationUpdated}>
                <Fab
                    color="success"
                    aria-label="save"
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                    }}
                    onClick={handleSaveAll}
                    disabled={selectedStudentIndex === null}
                >
                    <SaveIcon />
                </Fab>
            </Zoom>

        </Box>
    )
}

export default Evaluation
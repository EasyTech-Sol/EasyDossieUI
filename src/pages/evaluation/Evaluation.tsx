import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, FormControl, FormControlLabel, Checkbox, Divider } from "@mui/material"
import EvaluationAppBar from "./EvaluationAppBar"
import Fab from '@mui/material/Fab'; 
import SaveIcon from '@mui/icons-material/Save'; 
import StudentsBar from "./StudentsBar"
import StudentsScores from "./StudentsScores"
import { useEffect } from "react"
import { apiService } from "../../services/easydossie.service"
import { useParams } from "react-router-dom"
import { useEvaluationContext } from "../../contexts/EvaluationContext"
import { useStudentContext } from "../../contexts/StudentContext"


interface Criterion {
    id: number;
    title: string;
    descriptionId: string;
}
const DescriptionView: React.FC<{ 
    description: { id: string; title: string; criteria: Criterion[] }, 
    concepts: string[],
    getStudentEvaluation: (criterionId: number) => string,
    onConceptChange: (criterionId: number, concept: string) => void
}> = ({ description, concepts, getStudentEvaluation, onConceptChange }) => (
    <Box mt={4}>
        {/* Linha de Cabeçalho (Sem Indentação) */}
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pb={1}
            mb={1}
        >
            <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 'bold' }}>{description.title}</Typography>
            <Box display="flex" width={160} justifyContent="space-around">
                {concepts.map((concept) => (
                    <Typography
                        key={concept}
                        variant="body2"
                        sx={{
                            width: 30,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: '#333'
                        }}
                    >
                        {concept}
                    </Typography>
                ))}
            </Box>
        </Box>
        <Divider /> {/* Linha divisória abaixo do cabeçalho */}

        {/* Linhas dos Critérios (Com Indentação) */}
        <Box> {/* Container para as linhas */}
            {description.criteria.map((criterion, index) => (
                <Box
                    key={criterion.id}
                    display="flex"
                    alignItems="center"
                    py={1.5}
                    borderBottom="1px solid #eee"
                    sx={{
                        '&:last-child': { borderBottom: 'none' }
                    }}
                >
                    {/* Box para agrupar e indentar Número e Título */}
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', pl: 3 }}> {/* <<< INDENTAÇÃO APLICADA AQUI (pl: 3 = 24px) */}
                        <Typography variant="body2" sx={{ width: 30, pr: 1, color: '#666' }}>
                            {String(index + 1).padStart(2, '0')}
                        </Typography>
                        <Typography variant="body2" sx={{ flex: 1 }}>{criterion.title}</Typography>
                    </Box>

                    {/* Box das opções A, B, C, D (Mantém alinhamento com o cabeçalho) */}
                    <Box display="flex" width={160} justifyContent="space-around">
                        {concepts.map((concept) => (
                             <Box
                                key={concept}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 30,
                                    height: 30,
                                    backgroundColor: getStudentEvaluation(criterion.id) === concept ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                                    color: getStudentEvaluation(criterion.id) === concept ? '#000' : '#888',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    transition: 'background-color 0.2s',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                    }
                                }}
                                onClick={() => onConceptChange(criterion.id, concept)}
                            >
                                <Typography variant="body2">
                                    {concept}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    </Box>
);


const CategoryView: React.FC<{ 
    category: { id: number; title: string; weight: number; descriptions: any[] },
    concepts: string[],
    getStudentEvaluation: (criterionId: number) => string,
    onConceptChange: (criterionId: number, concept: string) => void
}> = ({ category, concepts, getStudentEvaluation, onConceptChange }) => (
    <Paper elevation={3} sx={{ p: 3, mt: 4, border: '1px solid #ddd', borderRadius: '4px' }}> {/* <<< ELEVAÇÃO APLICADA AQUI (elevation={3}) */}
        <Typography 
            variant="h6" 
            textAlign="center" 
            sx={{ 
                fontWeight: 'bold', 
                textTransform: 'uppercase', 
                mb: 2, 
                fontSize: '1.1rem', 
                color: '#444' 
            }}
        >
            {category.title} {category.weight * 10}%
        </Typography>
        {/* O Divider agora está dentro de DescriptionView */}
        {category.descriptions.map(description => (
            <DescriptionView 
                key={description.id} 
                description={description} 
                concepts={concepts}
                getStudentEvaluation={getStudentEvaluation}
                onConceptChange={onConceptChange}
            />
        ))}
    </Paper>
);

const Evaluation = () => {
    const { classId, dossierId } = useParams()
    const { setEvaluations, setDossierTemplate, dossierTemplate, evaluations } = useEvaluationContext()
    const { selectedStudentIndex, students } = useStudentContext()

    console.log("IDs da URL (useParams):", { classId, dossierId });
    useEffect(() => {
        const initializeAndFetchEvaluations = async () => {
            if (!classId || !dossierId) {
                console.log("useEffect - classId ou dossierId ausente. Saindo.");
                setDossierTemplate(null);
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
                    }
                } else if (backendResponseData.dossierTemplate) { 
                    // Esta parte ainda assume que o backend PODE enviar o template na raiz
                    // se a lista studentDossiers for vazia.
                    receivedDossierTemplate = backendResponseData.dossierTemplate;
                    console.log("Debug - Template pego da raiz da resposta (lista studentDossiers vazia)");
                }
    
                if (receivedDossierTemplate) {
                    setDossierTemplate(receivedDossierTemplate);
                } else {
                    console.error("Não foi possível determinar o dossierTemplate.");
                    setDossierTemplate(null); 
                    alert("Atenção: Não foi possível carregar a estrutura do dossiê (template). Verifique se a turma possui alunos e se o dossiê está corretamente configurado.");
                    setEvaluations([]);
                    return; 
                }
    
                // Formata as avaliações para o estado do frontend
                const formattedEvaluations = studentDossiers.map(sd => {
                    // logica de formatação e safety checks
                    if (!sd || typeof sd.studentId === 'undefined') {
                        console.error("Objeto 'sd' inválido ou sem studentId:", sd);
                        return { studentId: 'ID_ALUNO_INVALIDO', evaluation: [] }; 
                    }
                    if (!Array.isArray(sd.criterionEvaluation)) {
                        console.warn("'sd.criterionEvaluation' não é um array para o studentId:", sd.studentId, sd);
                        return { studentId: sd.studentId, evaluation: [] }; 
                    }
                    return {
                        studentId: sd.studentId,
                        evaluation: sd.criterionEvaluation.map(ce => {
                            if (!ce || typeof ce.criterionId === 'undefined' || typeof ce.concept === 'undefined') {
                                console.error("Objeto 'ce' inválido ou faltando criterionId/concept:", ce);
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
                console.log("useEffect - Evaluations formatadas:", formattedEvaluations);
    
            } catch (error) {
                console.error("Erro CRÍTICO no useEffect ao inicializar/buscar dados:", error);
                let errorMessage = "Não foi possível carregar os dados da avaliação. Verifique o console para detalhes.";
                if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = `Erro do servidor: ${error.response.data.message}`;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                alert(errorMessage);
                setDossierTemplate(null); 
                setEvaluations([]);
            }
        };
    
        initializeAndFetchEvaluations();
    
    }, [classId, dossierId, setDossierTemplate, setEvaluations]);


    const handleSaveAll = async () => {
        //existe um aluno selecionado?
        if (selectedStudentIndex === null || selectedStudentIndex === undefined || !students[selectedStudentIndex]) {
            console.error("Nenhum aluno selecionado para salvar.");
            alert("Por favor, selecione um aluno antes de salvar."); // Exemplo de feedback
            return;
        }
    
        const studentId = students[selectedStudentIndex].id;
    
        //pega todas as avaliacoes do aluno do estado local
        const studentEvaluationData = evaluations.find(ev => ev.studentId === studentId);
    
        //veerifica se existe algo para salvar
        if (!studentEvaluationData || studentEvaluationData.evaluation.length === 0) {
            console.warn("Nenhuma avaliação para salvar para este aluno.");
            alert("Nenhuma avaliação foi feita para este aluno."); 
            return;
        }
    
        //envia todas as avaliacoes para o backend
        try {
            
            await apiService.saveEvaluation(classId!, dossierId!, studentId, studentEvaluationData.evaluation);
            
            alert("Avaliações salvas com sucesso!"); 
    
        } catch (error) {
            alert("Ocorreu um erro ao salvar as avaliações. Tente novamente."); 
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
    };

    const getStudentEvaluation = (criterionId: number) => {
        if (selectedStudentIndex === null || selectedStudentIndex === undefined || !students[selectedStudentIndex]) return '';
        const studentId = students[selectedStudentIndex].id;
        const studentEvaluation = evaluations.find(ev => ev.studentId === studentId);
        return studentEvaluation?.evaluation.find(e => e.criterionId === criterionId)?.concept || '';
    };

    return (
        <>
            <EvaluationAppBar />
            <StudentsBar />

            <Box position={"relative"} width={"100%"}>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ width: '66.66%', p: 2 }}>
                        {dossierTemplate && (
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h4" gutterBottom textAlign="center">{dossierTemplate.title}</Typography>
                                <Typography variant="h5" textAlign="center">Área: {dossierTemplate.evaluationArea}</Typography>
                                <Typography variant="body1" paragraph>{dossierTemplate.description}</Typography>

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
                    </Box>
                    <Box sx={{ width: '33.33%' }}>
                        <StudentsScores />
                    </Box>
                </Box>

                 {/* BOTÃO SALVAR FLUTUANTE */}
                <Fab
                    color="primary"
                    aria-label="save"
                    sx={{
                        position: 'fixed', // Posição fixa
                        bottom: 32,      // Distância de baixo
                        right: 32,       // Distância da direita
                    }}
                    onClick={handleSaveAll} // Chama a nova função de salvar
                    disabled={selectedStudentIndex === null} // Desabilita se não houver aluno
                >
                    <SaveIcon />
                </Fab>
            </Box>
        </>
    )
}

export default Evaluation
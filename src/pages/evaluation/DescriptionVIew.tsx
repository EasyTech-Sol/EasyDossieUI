import { Box, Divider, Typography } from "@mui/material";

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

export default DescriptionView;
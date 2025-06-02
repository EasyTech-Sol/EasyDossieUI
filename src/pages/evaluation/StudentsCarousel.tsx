import { Box, Typography, IconButton, Fade } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useStudentContext } from '../../contexts/StudentContext';
import { useSnackbar } from '../../contexts/SnackBarContext';
import { useEvaluationContext } from '../../contexts/EvaluationContext';

export default function StudentsCarousel() {
    const { students, selectedStudentIndex, setSelectedStudentIndex } = useStudentContext()
    const { showMessage } = useSnackbar()
    const { hasEvaluationUpdated } = useEvaluationContext()


    const handleNext = () => {
        if (!hasEvaluationUpdated)
            setSelectedStudentIndex((prev) => (prev + 1) % students.length);
        else
            showMessage("Por favor, salve as alterações antes de trocar de estudante.",
                "error")
    };

    const handlePrev = () => {
        if (!hasEvaluationUpdated)
            setSelectedStudentIndex((prev) => (prev - 1 + students.length) % students.length);
        else
            showMessage("Por favor, salve as alterações antes de trocar de estudante.",
                "error")
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            p={2}
        >
            <IconButton onClick={handlePrev} sx={{
                transition: "transform 0.1s ease-in",
                "&:hover": {
                    transform: "scale(1.2)",
                    color: "black"
                }
            }}>
                <ArrowBackIos />
            </IconButton>

            <Fade key={selectedStudentIndex} in timeout={500}>
                <Typography variant="h6" sx={{ minWidth: '300px', textAlign: 'center' }}>
                    {students[selectedStudentIndex]?.name}
                </Typography>
            </Fade>

            <IconButton onClick={handleNext}>
                <ArrowForwardIos sx={{
                    transition: "transform 0.1s ease-in",
                    "&:hover": {
                        transform: "scale(1.2)",
                        color: "black"
                    }
                }} />
            </IconButton>
        </Box>
    );
}

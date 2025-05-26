import { Box, Typography, IconButton, Fade } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useStudentContext } from '../../contexts/StudentContext';

export default function StudentsCarousel() {
    const { students, selectedStudentIndex, setSelectedStudentIndex } = useStudentContext()


    const handleNext = () => {
        setSelectedStudentIndex((prev) => (prev + 1) % students.length);
    };

    const handlePrev = () => {
        setSelectedStudentIndex((prev) => (prev - 1 + students.length) % students.length);
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

import { useState } from 'react';
import { Box, Typography, IconButton, Fade } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useStudentContext } from '../../contexts/StudentContext';

export default function StudentsCarousel() {
    const { students } = useStudentContext()

    const [index, setIndex] = useState(0);

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % students.length);
    };

    const handlePrev = () => {
        setIndex((prev) => (prev - 1 + students.length) % students.length);
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

            <Fade key={index} in timeout={500}>
                <Typography variant="h6" sx={{ minWidth: '300px', textAlign: 'center' }}>
                    {students[index]?.name}
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

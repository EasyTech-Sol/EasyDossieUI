import { useState } from 'react';
import { Box, Typography, IconButton, Fade } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

interface StudentsCarouselProps {
    evaluations: Evaluation[]
}

export default function StudentsCarousel({evaluations}: StudentsCarouselProps) {
    const [index, setIndex] = useState(0);

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % evaluations.length);
    };

    const handlePrev = () => {
        setIndex((prev) => (prev - 1 + evaluations.length) % evaluations.length);
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
                    {evaluations[index].studentName}
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

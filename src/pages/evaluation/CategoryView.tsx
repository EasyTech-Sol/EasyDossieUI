import { Typography, Paper } from "@mui/material";
import DescriptionView from "./DescriptionVIew";

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
            {category.title} {category.weight}%
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

export default CategoryView
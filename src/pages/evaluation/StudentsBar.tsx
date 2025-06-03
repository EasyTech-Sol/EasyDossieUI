import { Button, Divider, Grid } from '@mui/material';
import StudentsCarousel from './StudentsCarousel';
import { apiService } from "../../services/easydossie.service"

interface StudentsBarProps {
    canExport: boolean;
    classId: number | string;
    dossierId: number | string;
}

const StudentsBar = ({ canExport, classId, dossierId }: StudentsBarProps) => {
    // Função para chamar a API de finalizar dossiê
    const handleFinalize = async () => {
        console.log("Tentando finalizar o dossiê...");
        console.log(`classId: ${classId}, dossierId: ${dossierId}`);
        
        try {
            console.log("Chamada para a API de finalização do dossiê...");
            const response = await apiService.finalizeStudentDossier(classId, dossierId);
            
            // Exibindo a resposta da API no console
            console.log("Resposta da API de finalização do dossiê:", response);
            
            console.log("Dossiê finalizado com sucesso.");
            alert("Dossiê finalizado com sucesso!");
        } catch (error) {
            console.error("Erro ao finalizar dossiê:", error);
            alert("Ocorreu um erro ao finalizar o dossiê.");
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
                        color="success" 
                        size='large' 
                        disabled={!canExport}
                        onClick={handleFinalize} // Chama a função handleFinalize ao clicar
                    >
                        FINALIZAR
                    </Button>
                </Grid>
            </Grid>
            <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}
        </>
    );
}

export default StudentsBar;

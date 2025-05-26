import { Box, Grid, Typography } from "@mui/material"
import EvaluationAppBar from "./EvaluationAppBar"
import StudentsBar from "./StudentsBar"
import StudentsScores from "./StudentsScores"
import { useEffect } from "react"
import { apiService } from "../../services/easydossie.service"
import { useParams } from "react-router-dom"

const Evaluation = () => {

    const {classId, dossierId} = useParams()

    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                const result = await apiService.getClassDossierEvaluation(classId!, dossierId!)
                console.log(result.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchEvaluations()
    }, [])

    return (
        <>
            <EvaluationAppBar />
            <StudentsBar />

            <Box position={"relative"} width={"100%"}>
                <Grid container bgcolor={"green"}>
                    <Grid size={8} bgcolor={"yellow"}>
                        <Typography> Substituir por dossie a ser preenchido</Typography>
                    </Grid>
                    <Grid size={4}>
                        <StudentsScores />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Evaluation
import { Box, Grid, Typography } from "@mui/material"
import EvaluationAppBar from "./EvaluationAppBar"
import StudentsBar from "./StudentsBar"

const Evaluation = () => {
    return (
        <>
            <EvaluationAppBar />
            <StudentsBar/>

            <Box position={"relative"} width={"100%"}>
                <Grid container bgcolor={"green"}>
                    <Grid size={8} bgcolor={"yellow"} height={"100vh"}>
                        <Typography> Substituir por dossie a ser preenchido</Typography>
                    </Grid>
                    <Grid size={4} bgcolor={"green"}>
                        Substituir por sidebar
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Evaluation
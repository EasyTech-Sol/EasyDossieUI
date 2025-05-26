import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'
import { Divider, Grid, Typography } from '@mui/material'

const StudentsBar = () => {
    return (
        <>
            <Grid container width={"100%"}>
                <Grid size={8} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <ArrowBackIos sx={{ color: '#37474f' }} />
                    <Typography variant="h4" sx={{ m: 1, color: '#37474f' }}>{"Nome"}</Typography>
                    <ArrowForwardIos sx={{ color: '#37474f' }} />
                </Grid>
                <Grid size={4}>
                </Grid>
            </Grid>
            <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}
        </>
    )
}

export default StudentsBar
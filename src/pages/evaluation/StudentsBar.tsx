import { Divider, Grid } from '@mui/material'
import StudentsCarousel from './StudentsCarousel'

const StudentsBar = () => {
    return (
        <>
            <Grid container width={"100%"}>
                <Grid size={8} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <StudentsCarousel/>
                </Grid>
                <Grid size={4}>
                </Grid>
            </Grid>
            <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}
        </>
    )
}

export default StudentsBar
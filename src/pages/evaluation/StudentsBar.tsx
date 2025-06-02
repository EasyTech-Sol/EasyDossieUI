import { Button, Divider, Grid } from '@mui/material'
import StudentsCarousel from './StudentsCarousel'

interface StudentsBarProps {
    canExport: boolean
}

const StudentsBar = ({ canExport }: StudentsBarProps) => {
    return (
        <>
            <Grid container width={"100%"}>
                <Grid size={8} display="flex" alignItems="center" justifyContent="center">
                    <StudentsCarousel />
                </Grid>
                <Grid paddingRight={5} size={4} display="flex" alignItems="center" justifyContent="flex-end">
                    <Button variant="contained" color="success" size='large' disabled={!canExport}
                    >
                        FINALIZAR
                    </Button>
                </Grid>
            </Grid>
            <Divider sx={{ my: 0.5 }} /> {/* Espaçamento vertical acima e abaixo */}
        </>
    )
}

export default StudentsBar
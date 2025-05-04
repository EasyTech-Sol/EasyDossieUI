import { Typography } from '@mui/material'

type AdviceTextProps = {
    children: React.ReactNode
}

const AdviceText = ({children}: AdviceTextProps) => {
    return (
        <Typography variant="caption" color="error">
            {children}
        </Typography>
    )
}

export default AdviceText
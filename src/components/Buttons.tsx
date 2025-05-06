import { alpha, styled } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import { MouseEventHandler } from 'react'

const successGreen = "#1B5E20"
const infoBlue = "#01579B"
const hoverGreen = "#7bf1a8"

interface SuccessButtonProps {
    title: string,
    onClick?: MouseEventHandler<HTMLButtonElement>,
}

const TextButton = ({ title, onClick }: SuccessButtonProps) => {
    return <Button
        variant="text"
        size='large'
        color="success"
        sx={{ '&:hover': { backgroundColor: "#f0f0f0" } }}
        onClick={onClick}
    >{title}</Button>
}

const ColorButton = (backgroundColor: string) => {
    return styled(Button)<ButtonProps>(({ theme }) => ({
        color: "#ffffff",
        backgroundColor: alpha(backgroundColor, 0.85),
        '&:hover': {
            backgroundColor,
        },
        width: "100%",
        height: "3.5rem"
    }));
}

const SuccessButton = ({ title, onClick }: SuccessButtonProps) => {
    const Success = ColorButton(successGreen)

    return (onClick ?
        <Success onClick={onClick}>{title}</Success>
        :
        <Success type='submit'>{title}</Success>
    )
}

const InfoButton = ({ title, onClick }: SuccessButtonProps) => {
    const Info = ColorButton(infoBlue)

    return (
        onClick ?
            <Info onClick={onClick}>{title}</Info>
            :
            <Info type='submit'>{title}</Info>
    )
}

const Buttons = {
    success: SuccessButton,
    info: InfoButton,
    text: TextButton
}

export default Buttons
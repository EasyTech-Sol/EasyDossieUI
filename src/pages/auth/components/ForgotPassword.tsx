import { Box, Button, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { apiService } from "../../../services/easydossie.service"
import { useError } from "../../../contexts/ErrorContext"
import { isAxiosError } from "axios"
import AdviceText from "./AdviceText"
import Buttons from "../../../components/Buttons"

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>()
  const { setError, setErrorMessage } = useError()

  const onSubmit = async (data: { email: string }) => {
    try {
      await apiService.forgotPassword(data.email)
      alert("Link de recuperação enviado para seu e-mail.")
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400)
        setErrorMessage(error.response?.data.error)
      else
        setErrorMessage(data.email)
      setError(true)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center",
      gap: "1.5rem"
    }}>
      <Box textAlign="center">
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Digite seu e-mail abaixo
        </Typography>
        <Typography variant="body2">
          para que possamos enviar um link de recuperação para a sua conta.
        </Typography>
      </Box>

      <TextField
        fullWidth
        type="email"
        label="E-mail"
        variant="filled"
        placeholder="Ex.: professor@gmail.com"
        {...register("email", { required: true })}
      />
      {errors.email && <AdviceText>Por favor, insira seu e-mail.</AdviceText>}

      <Box display="flex" flexDirection="column" gap="1rem">
        <Button variant="outlined" onClick={() => window.history.back()}  fullWidth
        sx={{
          backgroundColor: "#e8f5e9",
          color: "#4CAF50",
          fontWeight: "bold",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #4CAF50",
          textTransform: "uppercase",
        }}>
          Voltar
        </Button>
        <Buttons.success title="Continuar" type="submit" />
      </Box>
    </form>
  )
}

export default ForgotPassword

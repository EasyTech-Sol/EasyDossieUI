import { Box, Button, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { apiService } from "../../../services/easydossie.service"
import { useError } from "../../../contexts/ErrorContext"
import { isAxiosError } from "axios"
import AdviceText from "./AdviceText"

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<{ password: string, confirmPassword: string }>()
  const { setError, setErrorMessage } = useError()

  const onSubmit = async (data: { password: string, confirmPassword: string }) => {
    if (data.password !== data.confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      setError(true);
      return;
    }
  
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
  
    if (!token) {
      setErrorMessage("Token inválido ou ausente.");
      setError(true);
      return;
    }
  
    try {
      await apiService.resetPassword(token, data.password);
      alert("Senha redefinida com sucesso.");
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400)
        setErrorMessage(error.response?.data.error);
      else
        setErrorMessage("Erro ao redefinir a senha.");
      setError(true);
    }
  };
  

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
          Por favor, digite a nova senha para a sua conta.
        </Typography>
      </Box>

      <TextField
        fullWidth
        type="password"
        label="Senha"
        variant="filled"
        placeholder="Sua nova senha"
        {...register("password", { required: true })}
      />
      {errors.password && <AdviceText>Por favor, insira a nova senha.</AdviceText>}

      <TextField
        fullWidth
        type="password"
        label="Confirmar senha"
        variant="filled"
        placeholder="Sua nova senha, novamente"
        {...register("confirmPassword", { required: true })}
      />
      {errors.confirmPassword && <AdviceText>Por favor, confirme a nova senha.</AdviceText>}

      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{
          backgroundColor: "#2E7D32",
          color: "#fff",
          fontWeight: "bold",
          padding: "0.75rem",
          borderRadius: "8px",
          textTransform: "uppercase",
          "&:hover": {
            backgroundColor: "#1B5E20"
          }
        }}
      >
        Confirmar nova senha
      </Button>
    </form>
  )
}

export default ResetPassword

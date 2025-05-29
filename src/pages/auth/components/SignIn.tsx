import { Box, Link, TextField } from "@mui/material"
import Buttons from "../../../components/Buttons"
import { useForm } from "react-hook-form"
import { apiService } from "../../../services/easydossie.service"
import AdviceText from "./AdviceText"
import { isAxiosError } from "axios"
import PasswordField from "../../../components/PasswordField"
import { useSnackbar } from "../../../contexts/SnackBarContext"

const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>()
  const { showMessage } = useSnackbar();


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    try {
    const result = await apiService.login(values)
    localStorage.setItem("token", result.data.token)
    // localStorage.setItem("TeacherId", result.data.teacher.teacherId)
    window.location.href = "/home"
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400)
        showMessage(error.response.data.error, "error")
      else
        showMessage("Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde.", "error")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}
      style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <Box>
        <TextField type="email" fullWidth id="filled-basic"
          label="E-mail" variant="filled" {...register("email", { required: true })} />
        {errors.email && <AdviceText>Por favor, insira seu e-mail.</AdviceText>}
      </Box>
      <Box>
        <PasswordField register={register} field="password" label="Senha" rules={{ required: true }} />
        {errors.password && <AdviceText>Por favor, insira sua senha.</AdviceText>}
      </Box>
      <Box typography={"caption"}>
        <Buttons.success title="Entrar" />
        <Link href="/auth/recover-password">Esqueceu sua senha?</Link>
      </Box>
      <Buttons.text title="Cadastrar-se"
        onClick={() => { window.location.href = "/auth/sign-up" }} />
    </form>
  )
}

export default SignIn
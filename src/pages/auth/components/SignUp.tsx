import { Box, Link, TextField } from "@mui/material"
import Buttons from "../../../components/Buttons"
import { useForm } from "react-hook-form"
import AdviceText from "./AdviceText"
import { isAxiosError } from "axios"
import PasswordField from "../../../components/PasswordField"
import { apiService } from "../../../services/easydossie.service"
import { useSnackbar } from "../../../contexts/SnackBarContext"

type RegisterForm = RegisterData & {
  passwordCheck: string
}

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>()
  const password = watch("password")
  const { showMessage } = useSnackbar()

  const onSubmit = async (values: any) => {
    try {
      await apiService.register(values)
      window.location.href = "/auth/sign-in"
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
        <TextField size="small" type="text" fullWidth id="filled-basic" label="Nome" variant="filled"
          {...register("name", { required: true })} />
        {errors.name && <AdviceText>Por favor, insira seu nome.</AdviceText>}
      </Box>
      <Box>
        <TextField size="small" type="text" fullWidth id="filled-basic" label="CPF" variant="filled"
          {...register("cpf", { required: true })} />
        {errors.cpf && <AdviceText>Por favor, insira seu CPF.</AdviceText>}
      </Box>

      <Box>
        <TextField size="small" type="email" fullWidth id="filled-basic" label="E-mail" variant="filled"
          {...register("email", { required: true })} />
        {errors.email && <AdviceText>Por favor, insira seu e-mail.</AdviceText>}
      </Box>

      <Box>
        <PasswordField register={register}
          field="password" label="Senha"
          rules={{ required: true }}
          size={"small"} />
        {errors.password && <AdviceText>Por favor, insira sua senha.</AdviceText>}
      </Box>

      <Box>
        <PasswordField register={register}
          field="passwordCheck" label="Sua senha, novamente"
          rules={{
            required: "Por favor, insira sua senha novamente.", validate: (value: string) =>
              value === password || 'As senhas não coincidem.'
          }}
          size={"small"} />
        {errors.passwordCheck && <AdviceText>{errors.passwordCheck?.message}</AdviceText>}
      </Box>

      <Box typography={"caption"}>
        <Buttons.success title="Cadastrar-se" />
        <Link href="/auth/sign-in">Já possui uma conta?</Link>
      </Box>
    </form>

  )
}

export default Register
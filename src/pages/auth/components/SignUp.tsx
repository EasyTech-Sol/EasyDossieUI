import { Box, Link, TextField } from "@mui/material"
import Buttons from "../../../components/Buttons"
import { apiService } from "../../../services/easydossie.service"
import { useForm } from "react-hook-form"
import AdviceText from "./AdviceText"
import { useError } from "../../../contexts/ErrorContext"
import { isAxiosError } from "axios"
import PasswordField from "../../../components/PasswordField"

type SignUpForm = SignUpData & {
  senhaCheck: string
}

const SignUp = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpForm>()
  const { setError, setErrorMessage } = useError()
  const senha = watch("senha")

  const onSubmit = async (values: any) => {
    try {
      console.log(values)
      const result = await apiService.signup(values)
      localStorage.setItem("token", result.data.token)
      window.location.href = "/home"
    } catch (error) {
      if (isAxiosError(error) && error.status === 401)
        setErrorMessage("E-mail já cadastrado.")
      else
        setErrorMessage("Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde.")
      setError(true)
    }
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)}
      style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <Box>
        <TextField size="small" type="text" fullWidth id="filled-basic" label="Nome" variant="filled"
          {...register("nome", { required: true })} />
        {errors.nome && <AdviceText>Por favor, insira seu nome.</AdviceText>}
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
          field="senha" label="Senha"
          rules={{ required: true }}
          size={"small"} />
        {errors.senha && <AdviceText>Por favor, insira sua senha.</AdviceText>}
      </Box>

      <Box>
        <PasswordField register={register}
          field="senhaCheck" label="Sua senha, novamente"
          rules={{
            required: "Por favor, insira sua senha novamente.", validate: (value: string) =>
              value === senha || 'As senhas não coincidem.'
          }}
          size={"small"} />
        {errors.senhaCheck && <AdviceText>{errors.senhaCheck?.message}</AdviceText>}
      </Box>

      <Box typography={"caption"}>
        <Buttons.success title="Cadastrar-se" />
        <Link href="/auth/sign-in">Já possui uma conta?</Link>
      </Box>
    </form>

  )
}

export default SignUp
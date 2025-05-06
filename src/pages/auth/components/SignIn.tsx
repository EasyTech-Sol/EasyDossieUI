import { Box, Button, Link, TextField } from "@mui/material"
import Buttons from "../../../components/Buttons"
import { useForm } from "react-hook-form"
import { apiService } from "../../../services/easydossie.service"
import AdviceText from "./AdviceText"
import { useError } from "../../../contexts/ErrorContext"
import { isAxiosError } from "axios"
import PasswordField from "../../../components/PasswordField"

const SignIn = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>()
  const { setError, setErrorMessage } = useError()


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    try {
      console.log(values)
      const result = await apiService.login(values)
      localStorage.setItem("token", result.data.token)
      window.location.href = "/home"
    } catch (error) {
      if (isAxiosError(error) && error.status === 401)
        setErrorMessage("Credenciais inválidas.")
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
        <TextField type="email" fullWidth id="filled-basic"
          label="E-mail" variant="filled" {...register("email", { required: true })} />
        {errors.email && <AdviceText>Por favor, insira seu e-mail.</AdviceText>}
      </Box>
      <Box>
        <PasswordField register={register} field="senha" label="Senha" rules={{ required: true }} />
        {errors.senha && <AdviceText>Por favor, insira sua senha.</AdviceText>}
      </Box>
      <Box typography={"caption"}>
        <Buttons.success title="Entrar" />
        <Link href="/recuperar-senha">Esqueceu sua senha?</Link>
      </Box>
      <Buttons.text title="Cadastrar-se"
       onClick={() => { window.location.href = "/auth/sign-up" }}/>
    </form>
  )
}

export default SignIn
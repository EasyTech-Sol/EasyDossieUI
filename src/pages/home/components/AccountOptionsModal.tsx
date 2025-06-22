import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, Stack, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import PasswordField from '../../../components/PasswordField';
import { apiService } from '../../../services/easydossie.service';
import { useSnackbar } from '../../../contexts/SnackBarContext';

interface AccountOptionsModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

type EditAccountForm = {
  name: string;
  email: string;
  password: string;
  passwordCheck: string;
};

const AccountOptionsModal: React.FC<AccountOptionsModalProps> = ({ open, onClose, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<EditAccountForm>();
  const { showMessage } = useSnackbar();
  const password = watch('password');

  useEffect(() => {
    const storedName = localStorage.getItem('userName') ?? '';
    const storedEmail = localStorage.getItem('userEmail') ?? '';
    setUserName(storedName);
    setUserEmail(storedEmail);
  }, [open]);  // Sempre que o modal abrir, atualiza os dados

  const onSubmit = async (values: EditAccountForm) => {
  try {
    const userId = localStorage.getItem('token');

    if (!userId) {
      showMessage('ID do usuário não encontrado. Faça login novamente.', 'error');
      return;
    }

    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      tokenId: Number(userId),  
    };

    await apiService.editTeacher(payload);

    localStorage.setItem('userName', values.name);
    localStorage.setItem('userEmail', values.email);

    setUserName(values.name);
    setUserEmail(values.email);

    showMessage('Perfil atualizado com sucesso!', 'success');
    setEditing(false);
  } catch (error: any) {
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.[0]?.message ||
        'Erro ao editar o perfil. Tente novamente.';

      showMessage(backendMessage, 'error');
    }

};


  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 400,
          maxWidth: 600,
          width: '100%',
        }}
      >
        <Typography variant="h6" mb={2} textAlign="center">
          {editing ? 'Editar Perfil' : 'Meu Perfil'}
        </Typography>

        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <TextField
                size="small"
                fullWidth
                label="Nome"
                variant="filled"
                defaultValue={userName}
                {...register('name', { required: 'Por favor, insira seu nome.' })}
              />
              {errors.name && <Typography color="error">{errors.name.message}</Typography>}
            </Box>

            <Box mb={2}>
              <TextField
                size="small"
                fullWidth
                label="E-mail"
                variant="filled"
                defaultValue={userEmail}
                {...register('email', { required: 'Por favor, insira seu e-mail.' })}
              />
              {errors.email && <Typography color="error">{errors.email.message}</Typography>}
            </Box>

            <Box mb={2}>
              <PasswordField
                register={register}
                field="password"
                label="Nova Senha"
                rules={{ required: 'Por favor, insira sua nova senha.' }}
                size="small"
              />
              {errors.password && <Typography color="error">{errors.password.message}</Typography>}
            </Box>

            <Box mb={2}>
              <PasswordField
                register={register}
                field="passwordCheck"
                label="Confirme a nova senha"
                rules={{
                  required: 'Por favor, confirme sua senha.',
                  validate: (value: string) => value === password || 'As senhas não coincidem.',
                }}
                size="small"
              />
              {errors.passwordCheck && <Typography color="error">{errors.passwordCheck.message}</Typography>}
            </Box>

            <Stack spacing={2} mt={2}>
              <Button type="submit" variant="contained" color="success" fullWidth>
                Salvar Alterações
              </Button>
              <Button variant="text" color="error" fullWidth onClick={() => setEditing(false)}>
                Cancelar Edição
              </Button>
            </Stack>
          </form>
        ) : (
          <Stack spacing={2}>
            <Typography variant="body1">Nome: {userName}</Typography>
            <Typography variant="body1">E-mail: {userEmail}</Typography>

            <Button variant="contained" color="success" onClick={() => setEditing(true)}>
              Editar Perfil
            </Button>

            <Button variant="outlined" color="error" onClick={onDelete}>
              Excluir Perfil
            </Button>

            <Button variant="text" onClick={onClose}>
              Fechar
            </Button>
          </Stack>
        )}
      </Box>
    </Modal>
  );
};

export default AccountOptionsModal;

import { Box, TextField, Modal, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { apiService } from "../../services/easydossie.service";
import { useSnackbar } from "../../contexts/SnackBarContext";

interface AddStudentModalProps {
  open: boolean;
  handleClose: () => void;
  classId: number;
  onSuccess?: () => void;
}

const AddStudentModal = ({ open, classId, handleClose, onSuccess }: AddStudentModalProps) => {
  const { showMessage } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    if (!data.name?.trim() || !data.registration?.trim()) {
      showMessage("Nome e Matrícula não podem ser vazios ou conter apenas espaços.", "warning"); 
      return;
    }

    const payload = {
      id: data.id,
      name: data.name.trim(),
      registration: data.registration.trim(),
    };

    setLoading(true);
    try {
      await apiService.addStudent(classId, payload);

      showMessage("Aluno adicionado com sucesso!", "success");
      reset();
      handleClose(); 
      onSuccess?.(); 
    } catch (error: any) {
        console.error('Erro ao criar aluno:', error);

        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Não foi possível adicionar o aluno.';

        showMessage(errorMessage, "error");
      }
      finally {
            setLoading(false);
          }
        };

  // Função para fechar o modal e resetar o formulário
  const closeModalAndReset = () => {
    reset();
    handleClose();
  };


  return (
    <Modal open={open} onClose={closeModalAndReset}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* ícone fechar */}
        <IconButton
          aria-label="fechar"
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" align="center" gutterBottom>
          Adicionar Aluno
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column" }}>
          <Box marginBottom={2}>
            <TextField
              label="Nome do Aluno"
              variant="filled"
              fullWidth
              placeholder="Ex.: Antonio Salieri da Silva"
              {...register("name", { required: "Nome do aluno é obrigatório" })}
            />
            {errors.name && (
              <Typography color="error">{String(errors.name.message)}</Typography>
            )}
          </Box>

          <Box marginBottom={2}>
            <TextField
              label="Matrícula"
              variant="filled"
              fullWidth
              placeholder="Ex.: 2020"
              {...register("registration", { required: "Matrícula é obrigatória" })}
            />
            {errors.registration && (
              <Typography color="error">{String(errors.registration.message)}</Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={loading}
            fullWidth
          >
            {loading ? "Adicionando..." : "ADICIONAR ALUNO"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddStudentModal;

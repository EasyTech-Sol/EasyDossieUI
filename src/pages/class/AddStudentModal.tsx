import { Box, TextField, Modal, Button, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { apiService } from "../../services/easydossie.service"; // import do serviço de API

interface AddStudentModalProps {
  open: boolean;
  handleClose: () => void;
  classId: number;
  /** Callback a ser disparado quando o aluno for salvo com sucesso */
  onSuccess?: () => void;
}

const AddStudentModal = ({ open, classId, handleClose, onSuccess }: AddStudentModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    if (!data.name?.trim() || !data.registration?.trim()) {
      alert("Todos os campos são obrigatórios.");
      return;
    }


    // 2. Mapeia os campos do form para o que a API espera:
    const payload = {
      name: data.name,           // converte `name` → `nome`
      registration: data.registration,
       // converte `registration` → `matricula`
      // aqui você acrescenta outros campos caso haja
    };


    setLoading(true);
    try {
      // Uso do serviço de API em vez de fetch direto
      await apiService.addStudent(classId, payload);

      alert("Aluno adicionado com sucesso!");
      reset();
      handleClose();
      onSuccess?.();
    } catch (error: any) {
      console.error('Erro ao criar aluno:', error);
      alert(`Erro: ${error.message || 'Não foi possível adicionar o aluno.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
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

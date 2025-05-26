import {
  Box,
  TextField,
  Modal,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";

interface EditStudentModalProps {
  open: boolean;
  handleClose: () => void;
  student: Student | null;

  classId: number;
  onEdit: (payload: {
    id: number;
    name: string;
    registration: string;
    classId: number;
  }) => Promise<void>;
}

const EditStudentModal = ({
  open,
  handleClose,
  student,
  onEdit,
  classId
}: EditStudentModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const { showMessage } = useSnackbar();

  // Preenche o form quando abrir e houver aluno
  useEffect(() => {
    if (open && student) {
      setValue("name", student.name);
      setValue("registration", student.registration);
    }
  }, [open, student, setValue]);

  const onSubmit = async (data: any) => {
    if (!data.name.trim() || !data.registration.trim()) {
      showMessage("Todos os campos são obrigatórios.", "warning");
      return;
    }

    setLoading(true);
    
    try {
      await onEdit({
        id: student!.id,
        name: data.name,
        registration: data.registration,
        classId
      });
      showMessage("Aluno atualizado com sucesso!", "success");
      handleClose();

    } catch (err: any) {
      showMessage(`Erro ao atualizar aluno: ${err.message}`, "error");
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
        <IconButton
          aria-label="fechar"
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" align="center" gutterBottom>
          Editar Aluno
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Box mb={2}>
            <TextField
              label="Nome do Aluno"
              variant="filled"
              fullWidth
              {...register("name", {
                required: "Nome do aluno é obrigatório",
              })}
            />
            {errors.name && (
              <Typography color="error">
                {errors.name.message as string}
              </Typography>
            )}
          </Box>

          <Box mb={2}>
            <TextField
              label="Matrícula"
              variant="filled"
              fullWidth
              {...register("registration", {
                required: "Matrícula é obrigatória",
              })}
            />
            {errors.registration && (
              <Typography color="error">
                {errors.registration.message as string}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={loading}
            fullWidth
          >
            {loading ? "Salvando..." : "SALVAR ALTERAÇÕES"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditStudentModal;

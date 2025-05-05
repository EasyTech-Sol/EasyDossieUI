import { Box, TextField, Modal, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { apiService } from "../../../services/easydossie.service"

interface classInfo {
  id_turma: number;
  name: string;
  shift: string;
  institution: string;
  period: string;
}

interface EditClassModalProps {
  open: boolean;
  handleClose: () => void;
  id_turma: number; // ID da turma que vai ser editada
}

const EditClassModal = ({ open, handleClose, id_turma }: EditClassModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const originalData = useRef<classInfo | null>(null);

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const response = await apiService.getTurmaById(id_turma);
        const data = response.data;
  
        originalData.current = data;
  
        setValue("name", data.name);
        setValue("shift", data.shift);
        setValue("institution", data.institution);
        setValue("period", data.period);
      } catch (err: any) {
        alert(err.message || "Erro ao carregar dados.");
      }
    };
  
    if (open && id_turma) {
      fetchClassInfo();
    }
  }, [open, id_turma, setValue]);
  

  const validateAlphaNumeric = (value: string) =>
    /^[a-zA-Z0-9\s]+$/.test(value) || "Apenas letras e números são permitidos";

  const validatePeriod = (value: string) =>
    /^[0-9]{4}[-.]?[1-2]$/.test(value) || "Formato inválido (ex: 2025-1)";

  const onSubmit = async (data: any) => {
    for (const key of ["name", "shift", "institution", "period"]) {
      if (!data[key]?.trim()) {
        alert("Todos os campos são obrigatórios.");
        return;
      }
    }

    const current = {
      name: data.name,
      shift: data.shift,
      institution: data.institution,
      period: data.period,
    };

    const original = originalData.current;
    if (
      original &&
      current.name === original.name &&
      current.shift === original.shift &&
      current.institution === original.institution &&
      current.period === original.period
    ) {
      alert("Nenhuma alteração detectada.");
      return;
    }

    setLoading(true);
    try {
      await apiService.updateTurma(id_turma, {
        ...current,
        id_turma,
      });

      alert("Dados atualizados com sucesso!");
      handleClose();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }

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
        <Typography variant="h6" align="center" gutterBottom>
          Editar Turma
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Box marginBottom={2}>
            <TextField
              label="Nome da Turma"
              variant="filled"
              fullWidth
              {...register("name", {
                required: "Nome da turma é obrigatório",
                validate: validateAlphaNumeric,
              })}
            />
            {errors.name && (
              <Typography color="error">{String(errors.name.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Turno"
              variant="filled"
              fullWidth
              {...register("shift", {
                required: "Turno é obrigatório",
                validate: validateAlphaNumeric,
              })}
            />
            {errors.shift && (
              <Typography color="error">{String(errors.shift.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Instituição de Ensino"
              variant="filled"
              fullWidth
              {...register("institution", {
                required: "Instituição de ensino é obrigatória",
                validate: validateAlphaNumeric,
              })}
            />
            {errors.institution && (
              <Typography color="error">{String(errors.institution.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Período Letivo"
              variant="filled"
              fullWidth
              {...register("period", {
                required: "Período letivo é obrigatório",
                validate: validatePeriod,
              })}
            />
            {errors.period && (
              <Typography color="error">{String(errors.period.message)}</Typography>
            )}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="contained" color="success" type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Salvar"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};
}
export default EditClassModal;

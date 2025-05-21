import { Box, TextField, Modal, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { apiService } from "../../../services/easydossie.service"

interface classInfo {
  id: number;
  title: string;
  shift: string;
  institution: string;
  period: string;
}

interface EditClassModalProps {
  open: boolean;
  handleClose: () => void;
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  classToEdit: Class;
}

const EditClassModal = ({ open, handleClose, setClasses, classToEdit }: EditClassModalProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const originalData = useRef<classInfo | null>(null);
  const validateAlphaNumeric = (value: string) =>
    /^[a-zA-Z0-9\s]+$/.test(value) || "Apenas letras e números são permitidos";

  const validatePeriodoLetivo = (value: string) =>
    /^[0-9]{4}[-.]?[1-2]$/.test(value) || "Formato inválido (ex: 2025-1)";

  useEffect(() => {
    if (classToEdit) {
      setValue("title", classToEdit.title);
      setValue("shift", classToEdit.shift);
      setValue("institution", classToEdit.institution);
      setValue("period", classToEdit.period);

      originalData.current = {
        title: classToEdit.title,
        shift: classToEdit.shift,
        institution: classToEdit.institution,
        period: classToEdit.period,
        id: classToEdit.id
      };
    }
  }, [classToEdit, setValue]);


  const onSubmit = async (data: any) => {
    for (const key of ["title", "shift", "institution", "period"]) {
      if (!data[key]?.trim()) {
        alert("Todos os campos são obrigatórios.");
        return;
      }
    }

    if (
      data.title === classToEdit.title &&
      data.shift === classToEdit.shift &&
      data.institution === classToEdit.institution &&
      data.period === classToEdit.period
    ) {
      alert("Nenhuma alteração detectada.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.editClass({...data, classId: classToEdit.id});
      const updated = result.data.data;
      alert("Dados atualizados com sucesso!");
      setClasses(prev => {
        return prev.map(cls => cls.id === classToEdit.id ? ({...cls, ...updated}) : cls)
      });
      handleClose();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }

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
              InputLabelProps={{ shrink: true }}
              {...register("title", {
                required: "Nome da turma é obrigatório",
                validate: validateAlphaNumeric,
              })}
            />
            {errors.title && (
              <Typography color="error">{String(errors.title.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Turno"
              variant="filled"
              fullWidth
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
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
              InputLabelProps={{ shrink: true }}
              {...register("period", {
                required: "Período letivo é obrigatório",
                validate: validatePeriodoLetivo,
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
export default EditClassModal;

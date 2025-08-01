import { Box, TextField, Modal, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { apiService } from "../../../services/easydossie.service"
import { useSnackbar } from "../../../contexts/SnackBarContext";

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
    control,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const originalData = useRef<classInfo | null>(null);
  const validateAlphaNumeric = (value: string) =>
    /^[a-zA-Z0-9\s]+$/.test(value) || "Apenas letras e números são permitidos";

  const validatePeriodoLetivo = (value: string) =>
    /^[0-9]{4}[-.]?[1-2]$/.test(value) || "Formato inválido (ex: 2025-1)";

  const { showMessage } = useSnackbar();


  useEffect(() => {
    if (classToEdit) {
      setValue("title", classToEdit.title);
      setValue("shift", classToEdit.shift);
      setValue("institution", classToEdit.institution);
      setValue("period", classToEdit.lectivePeriod);

      originalData.current = {
        title: classToEdit.title,
        shift: classToEdit.shift,
        institution: classToEdit.institution,
        period: classToEdit.lectivePeriod,
        id: classToEdit.id
      };
    }
  }, [classToEdit, setValue]);


  const onSubmit = async (data: any) => {
    console.log(data)
    for (const key of ["title", "shift", "institution", "period"]) {
      if (!data[key]?.trim()) {
        showMessage("Todos os campos são obrigatórios.", "warning");
        return;
      }
    }

    if (
      data.title === classToEdit.title &&
      data.shift === classToEdit.shift &&
      data.institution === classToEdit.institution &&
      data.lectivePeriod === classToEdit.lectivePeriod
    ) {
      showMessage("Nenhuma alteração detectada.", "info");
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.editClass({ ...data, classId: classToEdit.id });
      const updated = result.data.data;
      showMessage(
        result.data?.message || "Dados atualizados com sucesso!",
        result.data?.type || "success"
      );

      setClasses(prev => {
        return prev.map(cls => cls.id === classToEdit.id ? ({ ...cls, ...updated }) : cls)
      });
      handleClose();
    } catch (error: any) {
      showMessage(
        error.response?.data?.message || error.message || "Erro ao atualizar turma.",
        error.response?.data?.type || "error"
      );
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

            <Controller
              name="shift"
              control={control}
              rules={{
                required: "Turno é obrigatório",
                validate: validateAlphaNumeric,
              }}
              render={({ field, fieldState }) => (
                <FormControl
                  fullWidth
                  variant="filled"
                  margin="dense"
                  sx={{ mb: 2 }}
                  error={!!fieldState.error}
                >
                  <InputLabel shrink id="shift-label">Turno</InputLabel>
                  <Select
                    {...field}
                    labelId="shift-label"
                    displayEmpty
                    renderValue={(selected) =>
                      selected ? (
                        <span>{selected}</span>
                      ) : (
                        <span style={{ color: 'rgba(0,0,0,0.5)' }}>Ex: Vespertino</span>
                      )
                    }
                  >
                    <MenuItem value="Matutino">Matutino</MenuItem>
                    <MenuItem value="Vespertino">Vespertino</MenuItem>
                    <MenuItem value="Noturno">Noturno</MenuItem>
                    <MenuItem value="Diurno">Diurno</MenuItem>
                    <MenuItem value="Integral">Integral</MenuItem>
                  </Select>
                  {fieldState.error && (
                    <FormHelperText>{fieldState.error.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

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
            {errors.lectivePeriod && (
              <Typography color="error">{String(errors.lectivePeriod.message)}</Typography>
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

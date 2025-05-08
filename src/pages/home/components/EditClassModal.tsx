import { Box, TextField, Modal, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { apiService } from "../../../services/easydossie.service"

interface classInfo {
  id_turma: number;
  titulo: string;
  turno: string;
  instituicao: string;
  periodoLetivo: string;
}

interface EditClassModalProps {
  open: boolean;
  handleClose: () => void;
  id_turma: string; // ID da turma que vai ser editada
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
}
  
const EditClassModal = ({ open, handleClose, id_turma, setClasses }: EditClassModalProps) => {
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

        setValue("titulo", data.titulo);
        setValue("turno", data.turno);
        setValue("instituicao", data.instituicao);
        setValue("periodoLetivo", data.periodoLetivo);
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

  const validatePeriodoLetivo = (value: string) =>
    /^[0-9]{4}[-.]?[1-2]$/.test(value) || "Formato inválido (ex: 2025-1)";

  const onSubmit = async (data: any) => {
    for (const key of ["titulo", "turno", "instituicao", "periodoLetivo"]) {
      if (!data[key]?.trim()) {
        alert("Todos os campos são obrigatórios.");
        return;
      }
    }

    const current = {
      titulo: data.titulo,
      turno: data.turno,
      instituicao: data.instituicao,
      periodoLetivo: data.periodoLetivo,
    };

    const original = originalData.current;
    if (
      original &&
      current.titulo === original.titulo &&
      current.turno === original.turno &&
      current.instituicao === original.instituicao &&
      current.periodoLetivo === original.periodoLetivo
    ) {
      alert("Nenhuma alteração detectada.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiService.updateTurma(id_turma, {
        ...current,
        id_turma,
      });

      const updated = result.data;

      alert("Dados atualizados com sucesso!");
      setClasses(prev => {
        return prev.map(cls => cls.id === id_turma ? updated : cls)
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
              {...register("titulo", {
                required: "Nome da turma é obrigatório",
                validate: validateAlphaNumeric,
              })}
            />
            {errors.titulo && (
              <Typography color="error">{String(errors.titulo.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Turno"
              variant="filled"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("turno", {
                required: "Turno é obrigatório",
                validate: validateAlphaNumeric,
              })}
            />
            {errors.turno && (
              <Typography color="error">{String(errors.turno.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Instituição de Ensino"
              variant="filled"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("instituicao", {
                required: "Instituição de ensino é obrigatória",
                validate: validateAlphaNumeric,
              })}
            />
            {errors.instituicao && (
              <Typography color="error">{String(errors.instituicao.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Período Letivo"
              variant="filled"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("periodoLetivo", {
                required: "Período letivo é obrigatório",
                validate: validatePeriodoLetivo,
              })}
            />
            {errors.periodoLetivo && (
              <Typography color="error">{String(errors.periodoLetivo.message)}</Typography>
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

import { Box, TextField, Modal, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

const EditClassModal = ({ open, handleClose }: any) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);

  // Dados para testar da turma
  const classData = {
    nome: "Turma A",
    turno: "Manhã",
    instituicao: "Instituição ABC",
    periodoLetivo: "2025-1",
  };

  // Preencher os campos com os dados simulados
  useEffect(() => {
    if (open) {
      setValue("nome", classData.nome);
      setValue("turno", classData.turno);
      setValue("instituicao", classData.instituicao);
      setValue("periodoLetivo", classData.periodoLetivo);
    }
  }, [open, setValue]);

  const onSubmit = (data: any) => {
    setLoading(true);
    console.log("Dados atualizados:", data);
    setTimeout(() => {
      setLoading(false);
      alert("Dados atualizados com sucesso!");
      handleClose();
    }, 1500);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" align="center" gutterBottom>Editar Turma</Typography>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column" }}>
          <Box marginBottom={2}>
            <TextField
              label="Nome da Turma"
              variant="filled"
              fullWidth
              {...register("nome", { required: "Nome da turma é obrigatório" })}
            />
            {errors.nome?.message && (
              <Typography color="error">{String(errors.nome.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Turno"
              variant="filled"
              fullWidth
              {...register("turno", { required: "Turno é obrigatório" })}
            />
            {errors.turno?.message && (
              <Typography color="error">{String(errors.turno.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Instituição de Ensino"
              variant="filled"
              fullWidth
              {...register("instituicao", { required: "Instituição de ensino é obrigatória" })}
            />
            {errors.instituicao?.message && (
              <Typography color="error">{String(errors.instituicao.message)}</Typography>
            )}
          </Box>
          <Box marginBottom={2}>
            <TextField
              label="Período Letivo"
              variant="filled"
              fullWidth
              {...register("periodoLetivo", { required: "Período letivo é obrigatório" })}
            />
            {errors.periodoLetivo?.message && (
              <Typography color="error">{String(errors.periodoLetivo.message)}</Typography>
            )}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="error" onClick={handleClose}>Cancelar</Button>
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

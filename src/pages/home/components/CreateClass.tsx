import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  DialogTitle,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";

interface CreateClassProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Class) => void;
}



const CreateClass = ({ open, onClose, onSave }: CreateClassProps) => {
  const {
    handleSubmit,
    control,
    reset
  } = useForm<Class>({
    defaultValues: {
      title: "",
      shift: "",
      institution: "",
      period: ""
    }
  });

  const onSubmit = (data: Class) => {
    onSave(data); // ou envie todos os dados se necessário
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ position: "relative" }}>
        <DialogTitle
          sx={{
            fontSize: 25,
            fontWeight: 700,
            px: 3,
            pt: 3
          }}
        >
          Criar Turma
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ px: 3 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                label="Nome da Turma"
                fullWidth
                variant="filled"
                placeholder="Ex: TEC499 Arquitetura de Computadores"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="shift"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Turno"
                fullWidth
                variant="filled"
                placeholder="Ex.: Vespertino"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="institution"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Instituição de Ensino"
                fullWidth
                variant="filled"
                placeholder="Ex.: Escola Lápis-Lazuli"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="period"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label="Período Letivo"
                fullWidth
                variant="filled"
                placeholder="Ex.: 2024.1 (Formato: AAAA.P)"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="success"
            sx={{
              height: "75px",
              fontSize: "1.1rem",
              "&:hover": {
                transform: "scale(1.01)"
              }
            }}
          >
            Criar Turma
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateClass;

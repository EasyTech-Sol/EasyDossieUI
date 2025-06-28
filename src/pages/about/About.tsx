import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

export default function About() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between', bgcolor: "#648D76" }}>
          <Typography variant="h6" fontWeight="bold">
            EasyDossiê
          </Typography>
          <Box>
            <Button color="inherit" sx={{ mr: 1 }} onClick={() => window.open("/auth/sign-in", '_blank')}>Entrar</Button>
            <Button variant="outlined" color="inherit" onClick={() => window.open("/auth/sign-up", '_blank')}>Cadastrar</Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* BODY */}
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 6 }}>
        <Paper elevation={0} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom fontWeight="bold">
            Organize suas turmas com facilidade
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: '1.25rem' }}>
            O EasyDossiê é uma plataforma feita para professores que querem mais controle, praticidade e clareza na hora de avaliar seus alunos.
            Com poucos cliques, você pode criar turmas, registrar alunos e montar dossiês avaliativos completos.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            O que você pode fazer com o EasyDossiê:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="👩‍🏫 Criar e gerenciar turmas com facilidade" />
            </ListItem>
            <ListItem>
              <ListItemText primary="📋 Cadastrar alunos e manter suas informações organizadas" />
            </ListItem>
            <ListItem>
              <ListItemText primary="📝 Criar dossiês de avaliação personalizados por turma" />
            </ListItem>
            <ListItem>
              <ListItemText primary="📥 Exportar os dossiês em PDF para registro ou compartilhamento" />
            </ListItem>
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Dúvidas Frequentes
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            Preciso pagar para usar?
          </Typography>
          <Typography paragraph>
            Não! O EasyDossiê é totalmente gratuito para professores. Basta criar sua conta e começar a usar.
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">
            Meus dados estão seguros?
          </Typography>
          <Typography paragraph>
            Sim. Todos os dados são armazenados com segurança e você pode exportar tudo quando quiser.
          </Typography>

          <Typography variant="subtitle1" fontWeight="bold">
            Posso usar com mais de uma turma?
          </Typography>
          <Typography paragraph>
            Claro! Você pode criar quantas turmas quiser e manter tudo organizado por ano, disciplina ou escola.
          </Typography>
        </Paper>
      </Container>

      {/* FOOTER */}
      <Box component="footer" sx={{ bgcolor: '#648D76', py: 2, mt: 'auto' }}>
        <Typography variant="body2" align="center" color="white">
          © {new Date().getFullYear()} EasyDossiê — Feito com ❤️ para professores.
        </Typography>
      </Box>
    </Box>
  );
}

import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

interface StudentsProps {
    alunos: any[]
    handleOpenEditModal: (aluno: {
        id: number;
        nome: string;
        matricula: string;
        classId: number;
    }) => void
    handleDeleteAluno: (id: number, classId: number) => void
}

const Students = ({ alunos, handleOpenEditModal, handleDeleteAluno }: StudentsProps) => {
    const classId = Number(useParams().classId)

    return (
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            {alunos.map((aluno) => (
                <Paper
                    key={aluno.id}
                    elevation={3}
                    sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderRadius: 2,
                    }}
                >
                    <Box>
                        <Box sx={{ fontSize: 18 }}><Typography>{aluno.nome}</Typography></Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton sx={{ color: "black" }} onClick={() => {
                            handleOpenEditModal({
                                id: aluno.id, nome: aluno.nome, matricula: aluno.matricula, classId, // ou de onde você tiver o ID da turma
                            })
                        }}>
                            <Edit fontSize="small" />
                        </IconButton>
                        <IconButton sx={{ color: "black" }} onClick={() => handleDeleteAluno(aluno.id, classId)}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            ))}
        </Box>)
}

export default Students
import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

interface StudentsProps {
    students: any[]
    handleOpenEditModal: (student: {
        id: number;
        name: string;
        registration: string;
        classId: number;
    }) => void
    handleDeleteStudent: (id: number) => void
}

const drawerWidth = 240;

const Students = ({ students, handleOpenEditModal, handleDeleteStudent }: StudentsProps) => {
    const classId = Number(useParams().classId)

    return (
        <Box sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: { md: `calc(100% - ${drawerWidth}px)` },
        }}>
            {students.map((student) => (
                <Paper
                    key={student.id}
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
                        <Box sx={{ fontSize: 18 }}>
                            <Typography>{student.name}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                            sx={{ color: "black" }}
                            onClick={() => {
                                handleOpenEditModal({
                                    id: student.id,
                                    name: student.name,
                                    registration: student.registration,
                                    classId,
                                })
                            }}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                            sx={{ color: "black" }}
                            onClick={() => handleDeleteStudent(student.id)}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                </Paper>
            ))}
        </Box>
    )
}

export default Students

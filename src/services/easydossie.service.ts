import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

export const apiService = {
  login: async (data: LoginData) => client.post("/login", data),
  signup: async (data: SignUpData) => client.post("/register", data),
  getTurmaById: async (id: string) => client.get(`/turmas/${id}`),
  updateTurma: async (id: string, data: any) => client.put(`/turmas/${id}`, data),
  deleteTurma: async (id: string) => client.delete(`/turmas/${id}`),
  createTurma: async (data: TurmaData) => client.post("/turmas", data),
  importStudents: async(classId: number, students: Student[]) => client.post('/importStudents', {classId, students}),
  listTurmas: async () => client.get("/return_classes"),

  //novo
  getAlunosByIdTurma: async (data:any) => client.get(`/return_students_class`,{params:data}),
  createAluno: async (data: any) => client.post("/add_student_manually", data), //dentro da turma
  deleteAluno:async (id: number, idClass: number) => client.delete("/remove_student", {params: { id: id, idClass: idClass }}),//dentro da turma
  editStudent: async (data: {id: number;name: string;registration: string;idClass: number;}) => client.patch("/edit_student", data)//dentro da turma
};


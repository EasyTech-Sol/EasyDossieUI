import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

export const apiService = {
  login: async (data: LoginData) => client.post("/api/usuario/login", data),
  signup: async (data: SignUpData) => client.post("/api/usuario/cadastro", data),
  getTurmaById: async (id: number) => client.get(`/turmas/${id}`),
  updateTurma: async (id: number, data: any) => client.put(`/turmas/${id}`, data),
  importStudents: async(classId: number, students: Student[]) => client.post('/importStudents', {classId, students}),

};

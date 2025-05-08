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
  getAlunosByIdTurma: async (data:any) => client.get(`/return_students_class`,{params:data}),
  createAluno: async (data: any) => client.post("/add_student_manually", data),
  deleteAluno:async (id: number, idClass: number) => client.delete("/remove_student", {params: { id: id, idClass: idClass }}),


  editStudent: async (data: {
    id: number;
    name: string;
    registration: string;
    idClass: number;
  }) => client.patch("/edit_student", data),
};
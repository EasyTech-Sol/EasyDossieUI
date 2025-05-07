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
  listTurmas: async () => client.get("/return_classes")
};


import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    Authorization: localStorage.getItem("token"),
  },
});

// Interceptor para redirecionar em caso de erro 403
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      window.location.href = "/auth/sign-in";
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  login: async (data: LoginData) => client.post("/teachers/login", data),
  signup: async (data: SignUpData) => client.post("/teachers/register", data),
  editTeacher: async (data: Teacher) => client.patch("/teachers", data),
  getClasses: async () => client.get("/classes"),
  editClass: async (data: Class) => client.post(`/classes/edit`, data),
  createClass: async (data: TurmaData) => client.post("/classes/create", data),
  getClassById: async (id: number) => client.get(`/classes/${id}`),
  deleteClass: async (id: number) => client.delete(`/classes/${id}`),
  importStudents: async (classId: number, students: Student[]) =>
    client.post("/students/import", { classId, students }),
  addStudent: async (classId: number, student: Student) =>
    client.post("/students/manual", { classId, ...student }),
  deleteStudent: async (classId: number, studentId: number) =>
    client.delete("/students", { params: { classId, studentId } }),
  getClassStudents: async (classId: number) =>
    client.get("/students", { params: { classId } }),
  editStudent: async (data: {
    id: number;
    name: string;
    registration: string;
    classId: number;
  }) => client.patch("/students", data), //dentro da turma
  getDossies: async () => client.get("/dossies"), 
  deleteDossie: (id: number) => client.delete(`/dossies/${id}`),
  editDossier: async (payload: any) => client.put("/dossier/edit", payload),
};

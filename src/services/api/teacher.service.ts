import client from "./client.service";

export const teacherApi = {
  login: async (data: LoginData) => client.post("/teachers/login", data),
  register: async (data: RegisterData) =>
    client.post("/teachers/register", data),
  editTeacher: async (data: Teacher) => client.patch("/teachers", data),
  deleteTeacher: async () => client.delete("/teachers"),
  sendResetLink: async (data: { email: string }) =>
    client.post("/teachers/send-reset-link", data),
};

import { classApi } from "./api/class.service";
import { dossierApi } from "./api/dossier.service";
import { studentApi } from "./api/student.service";
import { teacherApi } from "./api/teacher.service";

export const apiService = {

    ...teacherApi,
    ...studentApi,
    ...classApi,
    ...dossierApi,
  forgotPassword: async (email: string) =>
    client.post("/teachers/send-reset-link", {email}), //V

  resetPassword: async (token: string, newPassword: string) =>
    client.patch("/teachers/reset-password", { token, newPassword }),//V

  getDossiers: async () => client.get("/dossiers"), 
  deleteDossier: (id: number) => client.delete(`/dossiers/${id}`),
  editDossier: async (payload: any) => client.put("/dossier/edit", payload),

};


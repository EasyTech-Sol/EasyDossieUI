import client from "./client.service";

export const studentApi = {
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
  }) => client.patch("/students", data),
};

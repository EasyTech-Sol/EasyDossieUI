import client from "./client.service";

export const studentApi = {
  importStudents: async (classId: number, students: Student[]) =>
    client.post("/students/import", { classId, students }),
  addStudent: async (classId: number, student: Student) =>
    client.post("/students/manual", { classId, ...student }),
  deleteStudent: async (studentId: number) =>
    client.delete(`/students/${studentId}`),
  getClassStudents: async (classId: number) =>
    client.get(`/students/classes/${classId}`),
  editStudent: async (data: {
    id: number;
    name: string;
    registration: string;
    classId: number;
  }) => client.patch("/students", data),
};

import client from "./client.service";

export const classApi = {
  getClasses: async () => client.get("/classes"),
  editClass: async (data: Class) => client.post(`/classes/edit`, data),
  createClass: async (data: Class) => client.post("/classes/create", data),
  getClassById: async (id: number) => client.get(`/classes/${id}`),
  deleteClass: async (id: number) => client.delete(`/classes/${id}`),
};

import client from "./client.service";

export const classApi = {
  getClasses: async () => client.get("/classes"),
  editClass: async (data: Class) => client.patch(`/classes`, data),
  createClass: async (data: Class) => client.post("/classes/create", data),
  deleteClass: async (id: number) => client.delete(`/classes/${id}`),
};

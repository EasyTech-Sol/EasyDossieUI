import client from "./client.service";

export const dossierApi = {
  createDossier: async ({ templateData, categories }: DossierInput) =>
    client.post("/dossiers/create", { templateData, categories }),

  deleteDossierFromClass: async (dossierClassId: number) =>
    client.delete(`/dossiersClass/${dossierClassId}`), 

  getDossiersByClass: async (classId: number) =>
    client.get(`/dossiersClass/classes/${classId}`),

  
  getDossiers: async () => client.get("/dossiers"),
  deleteDossier: (id: number) => client.delete(`/dossiers/${id}`),
  editDossier: async (
    dossier: Dossier,
    questionIDs: any,
    categoryIDs: any,
    descriptionIDs: any
  ) =>
    client.put("/dossiers/edit", {
      ...dossier,
      questionIDs: questionIDs,
      categoryIDs: categoryIDs,
      descriptionIDs: descriptionIDs
    }),
};

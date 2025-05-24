import client from "./client.service";

export const dossierApi = {
  createDossier: async ({ templateData }: DossierInput) =>
    client.post("/dossiers/create", { templateData }),

  deleteDossierFromClass: async (dossierClassId: number) =>
    client.delete(`/dossiersClass/${dossierClassId}`), 

  getDossiersByClass: async (classId: number) =>
    client.get(`/classes/${classId}/dossiers`),

  
  getDossiers: async () => client.get("/dossiers"),
  deleteDossier: (id: number) => client.delete(`/dossiers/${id}`),
  associateDossierToClasses: async (dossierId: number, classIds: number[]) => {
    return client.post(`/dossiers/${dossierId}/classes/create`, { dossierId, classIds })
  },
  editDossier: async (
    dossier: Dossier,
    criteriaIDs: any,
    categoryIDs: any,
    descriptionIDs: any
  ) =>
    client.patch("/dossiers", {
      ...dossier,
      questionsIDs: criteriaIDs,
      categoryIDs: categoryIDs,
      descriptionIDs: descriptionIDs,
    }),
};

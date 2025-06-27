import client from "./client.service";

export const dossierApi = {
  createDossier: async ({ templateData }: DossierInput) =>
    client.post("/dossiers/create", { templateData }),

  deleteDossierFromClass: async ({ classId, dossierId }: ClassDossier) =>
    client.delete(`/dossiersClass/${classId}/${dossierId}`),

  getDossiersByClass: async (classId: number) =>
    client.get(`/classes/${classId}/dossiers`),

  getDossiers: async () => client.get("/dossiers"),
  deleteDossier: (id: number) => client.delete(`/dossiers/${id}`),
  associateDossierToClasses: async (dossierId: number, classIds: number[]) => {
    return client.post(`/dossiers/${dossierId}/classes/create`, {
      dossierId,
      classIds,
    });
  },
  editDossier: async (dossier: Dossier) =>
    client.patch("/dossiers", {
      ...dossier,
    }),
  getDossierById: async (id: number) => client.get(`/dossiers/${id}`),
  getClassesByDossier: async (dossierId: number) => client.get(`/dossiers/${dossierId}/classes`),
};

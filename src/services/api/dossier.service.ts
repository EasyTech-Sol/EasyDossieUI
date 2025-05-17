import client from "./client.service";

export const dossierApi = {
  createDossier: async ({ templateData, categories }: DossierInput) =>
    client.post("/dossier/create", { templateData, categories }),
  getDossiers: async () => client.get("/dossiers"),
  deleteDossier: (id: number) => client.delete(`/dossiers/${id}`),
  editDossier: async (
    dossier: Dossier,
    questionIDs: any,
    categoryIDs: any,
    descriptionIDs: any
  ) =>
    client.put("/dossier/edit", {
      ...dossier,
      questionIDs: questionIDs,
      categoryIDs: categoryIDs,
      descriptionIDs: descriptionIDs
    }),
};

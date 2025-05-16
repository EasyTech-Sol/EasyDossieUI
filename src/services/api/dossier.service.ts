import client from "./client.service";

export const dossierApi = {
  createDossier: async ({ templateData, categories }: DossierInput) =>
    client.post("/dossie/complete", { templateData, categories }),
  getDossiers: async () => client.get("/dossiers"), 
  deleteDossier: (id: number) => client.delete(`/dossiers/${id}`),
  editDossier: async (payload: Dossier) => client.put("/dossier/edit", payload),
};

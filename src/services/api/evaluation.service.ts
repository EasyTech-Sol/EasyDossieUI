import client from "./client.service";

export const evaluationApi = {
  getClassDossierEvaluation: (classId: number | string, dossierId: number | string) =>
    client.get(`/evaluations/${classId}/${dossierId}`),
};

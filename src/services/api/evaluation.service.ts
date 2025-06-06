import client from "./client.service";

export const evaluationApi = {
  createStudentDossiers: (classId: number | string, dossierId: number | string) =>
    client.post(`/dossiersStudent/create/${classId}/${dossierId}`), //criar/garantir

  getClassDossierEvaluation: (classId: number | string, dossierId: number | string) =>
    client.get(`/dossiersStudent/dossierClass/${classId}/${dossierId}`), //buscar TUDO

  saveEvaluation: (classId: number | string, dossierId: number | string, studentId: number, evaluations: { criterionId: number; concept: string }[]) =>
    client.post(`/evaluations/${classId}/${dossierId}/${studentId}`, { evaluations }), //salvar

  finalizeStudentDossier: (classId: number | string, dossierId: number | string) =>
    client.post(`/dossiersStudent/finalize/${classId}/${dossierId}`) // finalizar
};
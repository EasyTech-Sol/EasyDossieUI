import { classMocks } from "./api/class";
import { dossierMocks } from "./api/dossier";
import { evaluationMocks } from "./api/evaluation";
import { studentMocks } from "./api/student";
import { teacherMocks } from "./api/teacher";

export const handlers = [
  ...classMocks,
  ...teacherMocks,
  ...dossierMocks,
  ...studentMocks,
  ...evaluationMocks,
];

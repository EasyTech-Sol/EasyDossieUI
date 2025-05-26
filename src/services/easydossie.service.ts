import { classApi } from "./api/class.service";
import { dossierApi } from "./api/dossier.service";
import { evaluationApi } from "./api/evaluation.service";
import { studentApi } from "./api/student.service";
import { teacherApi } from "./api/teacher.service";

export const apiService = {
    ...teacherApi,
    ...studentApi,
    ...classApi,
    ...dossierApi,
    ...evaluationApi,
};

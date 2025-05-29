import { http, HttpResponse } from "msw";
import { routeTo } from "../utils/routeTo";
import { mocked_evaluations } from "../utils/mockedEvaluations";

export const evaluationMocks = [
    http.get(routeTo("/evaluations/:classId/:dossierId"), () => {
        return HttpResponse.json(mocked_evaluations, {status: 200})
    })
]
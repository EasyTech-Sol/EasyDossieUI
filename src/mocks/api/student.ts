import { http, HttpResponse } from "msw";
import { routeTo } from "../utils/routeTo";
import { mocked_students } from "../utils/mockedStudents";

export const studentMocks = [
    http.get(routeTo(`/students/classes/:classId`), () => {
        return HttpResponse.json({students: mocked_students}, {status: 200})
    }),

    http.delete(routeTo(`/students/:id`), () => {
        return HttpResponse.json({message: "ok"}, {status: 200})
    })
]
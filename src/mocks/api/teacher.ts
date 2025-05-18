import { http, HttpResponse } from "msw";
import { routeTo } from "../utils/routeTo";

export const teacherMocks = [
  http.post(routeTo("teachers/login"), () => {
    return HttpResponse.json(
      {
        message: "string",
        teacher: {
          id: "string",
          name: "string",
          email: "string",
          cpf: "string",
        },
        token: "string",
      },
      { status: 200 }
    );
  }),

  http.post(routeTo("/teachers/register"), () => {
    return HttpResponse.json(
      {
        message: "string",
        teacher: {
          id: "string",
          name: "string",
          email: "string",
          cpf: "string",
        },
      },
      { status: 200 }
    );
  }),

  http.patch(routeTo("/teachers"), async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),
];

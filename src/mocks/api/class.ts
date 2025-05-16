import { http, HttpResponse } from "msw";
import { routeTo } from "../utils/routeTo";
import { mocked_classes } from "../utils/mockedClasses";

export const classMocks = [
  http.post(routeTo("/classes/edit"), async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),

  http.get(routeTo("/return_classes"), () => {
    return HttpResponse.json({ classes: mocked_classes }, { status: 200 });
  }),

  http.delete(routeTo("/classes/:id"), () => {
    return HttpResponse.json({ mensagem: "deu certo" }, { status: 200 });
  }),

  http.get(routeTo("/turmas/:id"), ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      mocked_classes.find((cls) => cls.id === Number(id)),
      { status: 200 }
    );
  }),

  http.post(routeTo("/turmas"), async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),
];

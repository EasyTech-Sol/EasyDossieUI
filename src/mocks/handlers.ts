import { http, HttpResponse } from "msw";
import { mocked_classes } from "./mocked_data";

export const handlers = [
  http.post("http://localhost:3000/login", () => {
    return HttpResponse.json({ token: "generic-token" }, { status: 200 });
  }),

  http.post("http://localhost:3000/cadastro", () => {
    return HttpResponse.json({ token: "generic-token" }, { status: 200 });
  }),

  http.put("http://localhost:3000/turmas/:id", async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),

  http.get("http://localhost:3000/return_classes", () => {
    return HttpResponse.json({ classes: mocked_classes }, { status: 200 });
  }),

  http.delete("http://localhost:3000/turmas/:id", () => {
    return HttpResponse.json({ mensagem: "deu certo" }, { status: 200 });
  }),

  http.get("http://localhost:3000/turmas/:id", ({ params }) => {
    const { id } = params;
    return HttpResponse.json(
      mocked_classes.find((cls) => cls.id === id),
      { status: 200 }
    );
  }),

  http.post("http://localhost:3000/turmas", async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),
];

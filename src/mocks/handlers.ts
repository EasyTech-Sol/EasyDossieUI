import { http, HttpResponse } from "msw";
import { mocked_classes } from "./mocked_data";
import dossiersList from "./dossiers_list.json"

export const handlers = [
  http.post("http://localhost:3000/teachers/login", () => {
    return HttpResponse.json({ token: "generic-token" }, { status: 200 });
  }),

  http.post("http://localhost:3000/teachers/register", () => {
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
      mocked_classes.find((cls) => cls.id === Number(id)),
      { status: 200 }
    );
  }),
  http.get("http://localhost:3000/dossiers", () => {
    return HttpResponse.json(dossiersList, {status: 200})
  }),

  http.post("http://localhost:3000/turmas", async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),

  http.delete(`http://localhost:3000/dossiers/:id`, () => {
    return HttpResponse.json({message: "ok"}, {status: 200})
  }),
];

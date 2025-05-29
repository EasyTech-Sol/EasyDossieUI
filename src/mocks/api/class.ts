import { http, HttpResponse } from "msw";
import { routeTo } from "../utils/routeTo";
import { mocked_classes } from "../utils/mockedClasses";
import { mocked_dossiers } from "../utils/mockedDossiers";

export const classMocks = [
  http.post(routeTo("/classes/edit"), async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json(data, { status: 200 });
  }),

  http.get(routeTo("/classes"), () => {
    return HttpResponse.json({ classes: mocked_classes }, { status: 200 });
  }),

  http.get(routeTo("/classes/:id/dossiers"), () => {
    return HttpResponse.json(
      {
        associatedDossiers: mocked_dossiers.map(
          (ad: any) => ({dossierTemplate: ad})
        ),
      },
      { status: 200 }
    );
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

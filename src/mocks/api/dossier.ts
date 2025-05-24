import { http, HttpResponse } from "msw";
import { routeTo } from "../utils/routeTo";
import { mocked_dossiers } from "../utils/mockedDossiers";

export const dossierMocks = [
  http.get(routeTo("/dossiers"), () => {
    return HttpResponse.json(
      { message: "ok", dossiers: mocked_dossiers },
      { status: 200 }
    );
  }),

  http.patch(routeTo("/dossiers"), async ({ request }) => {

    const data: any = await request.json()

    return HttpResponse.json(
      {
        message: "ok",
        data: {
          credentials: {
            id: data.id,
            title: data.title,
          },
        },
      },
      { status: 200 }
    );
  }),

  http.delete(routeTo("/dossiers/:id"), () => {
    return HttpResponse.json({ message: "ok" }, { status: 200 });
  }),
];

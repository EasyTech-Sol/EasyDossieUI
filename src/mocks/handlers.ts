import { http, HttpResponse } from "msw"

export const handlers = [
    http.post("http://localhost:3000/login", () => {
        return HttpResponse.json({token: "generic-token"}, {status: 200})
    }),

    http.post("http://localhost:3000/signup", () => {
        return HttpResponse.json({token: "generic-token"}, {status: 200})
    })

]
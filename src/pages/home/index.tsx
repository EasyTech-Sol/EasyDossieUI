import { Navigate } from "react-router-dom";
import Template from "./template/Template";
import ClassesDashboard from "./components/ClassesDashboard";

export function routes(startPath: string) {
    return {
        path: startPath,
        element: <Template />,
        async loader() {
            if (!localStorage.getItem("token")) {
                window.location.href = "/auth/sign-in";
                return;
            }
            return true;
        },
        children: [
            {
                path: "",
                element: <Navigate to="home" replace />
            },
            { path: "home", element: <ClassesDashboard /> },
        ],
    };
}

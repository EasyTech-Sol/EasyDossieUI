import { Navigate } from "react-router-dom";
import ClassesDashboard from "./classes/ClassesDashboard";
import DossiersDashboard from "./dossiers/DossiersDashboard"; // Importe o componente
import MainLayout from "../../components/layout/MainLayout";
import { DossierProvider } from "../../contexts/DossierContext";
import * as classApp from "../class/index";

export function routes(startPath: string) {
    return {
        path: startPath,
        element: <MainLayout />,
        children: [
            {
                path: "",
                element: <Navigate to="home" replace />
            },
            { path: "home", element: <ClassesDashboard /> },
            {
                path: "dossiers", element:
                    <DossierProvider> <DossiersDashboard /> </DossierProvider>
            },
            classApp.routes("class"),
        ],
    };
}
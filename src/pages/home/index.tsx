import { Navigate } from "react-router-dom";
import { lazy } from "react";
const ClassesDashboard = lazy(() => import("./classes/ClassesDashboard"));
const DossiersDashboard = lazy(() => import("./dossiers/DossiersDashboard"));
const MainLayout = lazy(() => import("../../components/layout/MainLayout"));
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
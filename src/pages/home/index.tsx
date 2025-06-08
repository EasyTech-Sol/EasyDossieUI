import { Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
const ClassesDashboard = lazy(() => import("./classes/ClassesDashboard"));
const DossiersDashboard = lazy(() => import("./dossiers/DossiersDashboard"));
const MainLayout = lazy(() => import("../../components/layout/MainLayout"));
import { DossierProvider } from "../../contexts/DossierContext";
import * as classApp from "../class/index";
import SuspenseFallback from "../../components/common/SuspenseFallback";

export function routes(startPath: string) {
    return {
        path: startPath,
        element: <Suspense fallback={<SuspenseFallback />}><MainLayout /></ Suspense>,
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
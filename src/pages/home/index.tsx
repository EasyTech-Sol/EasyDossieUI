import { Navigate } from "react-router-dom";
import ClassesDashboard from "./classes/ClassesDashboard";
import DossiersDashboard from "./dossiers/DossiersDashboard"; // Importe o componente
import Class from "../class/Class";
import { TabsProvider } from "../../contexts/TabContext";
import MainLayout from "../../components/layout/MainLayout";

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
            { path: "dossiers", element: <DossiersDashboard /> }, // Adicionada a rota para DossiersDashboard
            { path: "/class/:classId", element: <TabsProvider><Class /></TabsProvider> },
        ],
    };
}
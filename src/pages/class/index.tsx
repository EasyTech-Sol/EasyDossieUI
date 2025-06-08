import { Outlet } from "react-router-dom";
import { EvaluationProvider } from "../../contexts/EvaluationContext"
import { TabsProvider } from "../../contexts/TabContext"
import { lazy } from "react";
const Evaluation = lazy(() => import("../evaluation/Evaluation"));
const Class = lazy(() => import("./Class"));
import { StudentProvider } from "../../contexts/StudentContext";


const CommonProviders = () => (
    <StudentProvider>
        <TabsProvider>
            <Outlet />
        </TabsProvider>
    </StudentProvider>
);

export const routes = (startPath: string) => {
    return {
        path: startPath,
        element: <CommonProviders />,
        children: [
            {
                path: ":classId", element:
                    <Class />
            },
            {
                path: ":classId/dossier/:dossierId/evaluation", element:
                    <EvaluationProvider>
                        <Evaluation />
                    </EvaluationProvider>
            }

        ]
    }

}


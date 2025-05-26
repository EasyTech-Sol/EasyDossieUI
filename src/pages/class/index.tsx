import { EvaluationProvider } from "../../contexts/EvaluationContext"
import { TabsProvider } from "../../contexts/TabContext"
import Evaluation from "../evaluation/Evaluation"
import Class from "./Class"

export const routes = (startPath: string) => {
    return {
        path: startPath,
        children: [
            {
                path: ":classId", element:
                    <TabsProvider><Class /></TabsProvider>
            },
            {
                path: ":classId/dossier/:dossierId/evaluation", element:
                    <EvaluationProvider>
                        <TabsProvider><Evaluation /> </TabsProvider>
                    </EvaluationProvider>
            }

        ]
    }

}


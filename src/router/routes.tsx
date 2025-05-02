import { createBrowserRouter, Navigate } from "react-router-dom";

import * as authApp from "../pages/auth";
import Home from "../pages/Home";

export const routes = createBrowserRouter([
    authApp.routes("/auth"),
    {
        path: "",
        element: <Navigate to="auth" replace />
    },
    {
        path: "/home",
        element: <Home />,
    }
]);

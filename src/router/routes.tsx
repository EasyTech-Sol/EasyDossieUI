import { createBrowserRouter, Navigate } from "react-router-dom";
import * as authApp from "../pages/auth";
import * as home from "../pages/home"
import ListDossierPage from "../pages/dossiers/ListDossierPage";

export const routes = createBrowserRouter([
  authApp.routes("/auth"),
  {
    path: "",
    element: <Navigate to="auth" replace />,
  },
  home.routes("/"),
  {
    path: "/test", element: <ListDossierPage />
  }
]);

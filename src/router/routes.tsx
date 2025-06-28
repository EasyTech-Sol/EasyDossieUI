import { createBrowserRouter, Navigate } from "react-router-dom";
import * as authApp from "../pages/auth";
import * as home from "../pages/home"
import * as about from "../pages/about";
export const routes = createBrowserRouter([
  authApp.routes("/auth"),
  {
    path: "",
    element: <Navigate to="auth" replace />,
  },
  home.routes("/"),
  about.routes("/about")
]);

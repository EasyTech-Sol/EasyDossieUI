import { createBrowserRouter, Navigate } from "react-router-dom";
import * as authApp from "../pages/auth";
import * as home from "../pages/home"
import Landing from "./Landing";

export const routes = createBrowserRouter([
  authApp.routes("/auth"),
  {
    path: "",
    element: <Navigate to="auth" replace />,
  },
  home.routes("/"),
  { path: "test", 
    element: <Landing/>
  }
]);

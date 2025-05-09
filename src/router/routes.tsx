import { createBrowserRouter, Navigate } from "react-router-dom";
import * as authApp from "../pages/auth";
import Home from "../pages/Home";
import Class from "../pages/Class";

export const routes = createBrowserRouter([
  authApp.routes("/auth"),
  {
    path: "",
    element: <Navigate to="auth" replace />,
  },
  {
    path: "/home",
    async loader() {
      if (!localStorage.getItem("token")) {
        window.location.href = "/auth/sign-in";
        return;
      }
      return true;
    },
    element: <Home />,
  },
  {
    path: "/class/:classId",
    async loader({ params }) {
      if (!localStorage.getItem("token")) {
        window.location.href = "/auth/sign-in";
        return;
      }
      return { classId: params.classId };
    },
    element: <Class />,
  },
]);

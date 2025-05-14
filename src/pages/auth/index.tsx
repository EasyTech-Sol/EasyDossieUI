import { Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Template from "./template/Template";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

export function routes(startPath: string) {
    return {
        path: startPath,
        element: <Template />,
        children: [
            {
                path: "",
                element: <Navigate to="sign-in" replace />
            },
            { path: "sign-in", element: <SignIn /> },
            { path: "sign-up", element: <SignUp /> },
            { path: "recover-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <ResetPassword /> }
        ],
    };
}

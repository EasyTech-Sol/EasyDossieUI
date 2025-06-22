import { Navigate } from "react-router-dom";
import { Suspense } from "react";
import SuspenseFallback from "../../components/common/SuspenseFallback";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Template from "./template/Template";

export function routes(startPath: string) {
    return {
        path: startPath,
        element: <Suspense fallback={<SuspenseFallback />}><Template /></ Suspense>,
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

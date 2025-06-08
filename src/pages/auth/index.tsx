import { Navigate } from "react-router-dom";
import { lazy } from "react";

const SignIn = lazy(() => import("./components/SignIn"));
const SignUp = lazy(() => import("./components/SignUp"));
const Template = lazy(() => import("./template/Template"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));

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

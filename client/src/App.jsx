import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgetPasswordRequest from "./pages/forget-password-request";
import ResetPassword from "./pages/reset-password";
import VerifyEmail from "./pages/verify-email";
import Chat from "./pages/chat";
import useAuth from "./features/auth/use-auth";
import LoadingUI from "./components/loading-ui";
import ProtectedRoutes from "./routes/protected-routes";

const App = () => {
  useAuth();
  return (
    <div>
      <LoadingUI>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route
            path="/auth/forgot-password-request"
            element={<ForgetPasswordRequest />}
          />
          <Route
            path="/auth/reset-password/:token"
            element={<ResetPassword />}
          />
          <Route path="/auth/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="/" element={<Chat />} />
          </Route>
        </Routes>
      </LoadingUI>
    </div>
  );
};

export default App;

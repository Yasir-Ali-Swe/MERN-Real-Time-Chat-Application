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
import AuthRoutes from "./routes/auth-routes";
import NotFound from "./pages/404-not-found";
import ConversationList from "./components/chat/conversation-list";
import FriendsList from "./components/chat/friends-list";
import ChatLayout from "./components/chat/chat-layout";
import ConversationLayout from "./components/chat/conversation-layout";

const App = () => {
  useAuth();
  return (
    <div>
      <LoadingUI>
        <Routes path="/auth/*" element={<AuthRoutes />}>
          <Route element={<AuthRoutes />}>
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
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route element={<ChatLayout />}>
              <Route element={<ConversationLayout />}>
                <Route path="/friends" element={<FriendsList />} />
                <Route path="/conversations" element={<ConversationList />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </LoadingUI>
    </div>
  );
};

export default App;

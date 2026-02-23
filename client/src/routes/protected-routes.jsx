import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";
import Sidebar from "@/components/chat/sidebar";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-8 font-semibold animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="flex h-[calc(100vh-12px)] gap-1 px-2 py-1">
      {/* Sidebar */}
      <Sidebar />
      {/* Conversation list */}
      <div className="w-72 border-2 flex items-center justify-center">
        <h1 className="text-xl font-semibold">Conversation</h1>
      </div>

      {/* Chat / Outlet */}
      <div className="flex-1 border-2 flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoutes;

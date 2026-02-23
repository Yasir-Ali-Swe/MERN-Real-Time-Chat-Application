import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";


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

  return <Outlet />;
};

export default ProtectedRoutes;

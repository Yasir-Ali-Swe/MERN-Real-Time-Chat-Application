import React from "react";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";

const LoadingUI = ({ children }) => {
  const isLoading = useSelector((state) => state.auth.isLoading);

  if (!isLoading) {
    return children;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-8 font-semibold animate-spin" />
    </div>
  );
};

export default LoadingUI;

import React from "react";
import { Loader } from "lucide-react";

const forgetPasswordRequest = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl text-primary font-black underline">
        Forget Password Request Page
      </h1>
      <Loader className="text-primary size-15 animate-spin" />
    </div>
  );
};

export default forgetPasswordRequest;

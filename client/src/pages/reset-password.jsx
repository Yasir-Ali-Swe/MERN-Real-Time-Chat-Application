import React from "react";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams();
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl text-primary font-black underline">
        Reset Password Page for token: {token}
      </h1>
    </div>
  );
};

export default ResetPassword;

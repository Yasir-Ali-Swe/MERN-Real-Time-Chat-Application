import React from "react";
import { useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl text-primary font-black underline">
        Verify Email Page for token: {token}
      </h1>
    </div>
  );
};

export default VerifyEmail;

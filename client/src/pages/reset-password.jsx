import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import RestPasswordUi from "../components/auth/reset-password";
import { MessageCircleMore, Loader } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen px-3 lg:p-0">
      {loading ? (
        <RestPasswordUi token={token} />
      ) : (
        <>
          <div className="my-5 flex items-center justify-center gap-3">
            <h1 className="text-3xl font-bold">NexTalk</h1>
            <MessageCircleMore className="size-9" />
          </div>
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Please wait we are verifying your request</h1>
            <Loader className="size-8 font-semibold animate-spin" />
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPassword;

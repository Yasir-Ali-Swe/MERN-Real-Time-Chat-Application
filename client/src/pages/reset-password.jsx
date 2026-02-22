import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ResetPasswordUi from "../components/auth/reset-password";
import { MessageCircleMore, Loader } from "lucide-react";
import { verifyForgetPasswordToken } from "@/lib/auth-api";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsVerifying(false);
      return;
    }

    verifyForgetPasswordToken(token)
      .then(() => {
        setIsTokenValid(true);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Invalid or expired reset link",
        );
        setIsTokenValid(false);
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [token]);

  // ⏳ Loader
  if (isVerifying) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen">
        <div className="my-5 flex items-center gap-3">
          <h1 className="text-3xl font-bold">NexTalk</h1>
          <MessageCircleMore className="size-9" />
        </div>

        <div className="flex items-center gap-4 text-center">
          <h1 className="text-2xl font-semibold">
            Please wait, we are verifying your request
          </h1>
          <Loader className="size-8 animate-spin" />
        </div>
      </div>
    );
  }

  // ❌ Invalid token
  if (!isTokenValid) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-screen">
        <h1 className="text-xl font-semibold text-destructive">
          This reset link is invalid or expired
        </h1>
        <Button
          variant="outline"
          className="ml-4"
          onClick={() => navigate("/auth/forgot-password-request")}
        >
          Request new link
        </Button>
      </div>
    );
  }

  // ✅ Valid token → show form 
  return <ResetPasswordUi token={token} />;
};

export default ResetPassword;

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MessageCircleMore, EyeOff, Eye, Loader } from "lucide-react";
import { resetPassword } from "@/lib/auth-api";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const ResetPasswordUi = ({ token }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ password, token }) => resetPassword(password, token),
    onSuccess: (response) => {
      toast.success(response.message || "Password reset successful");
      setFormData({ password: "", confirmPassword: "" });
      navigate("/auth/login");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Password reset failed");
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { password, confirmPassword } = formData;

    // if (password.length < 6) {
    //   toast.error("Password must be at least 8 characters");
    //   return;
    // }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutate({ password: formData.password, token });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen px-3">
      <div className="my-5 flex items-center gap-3">
        <h1 className="text-3xl font-bold">NexTalk</h1>
        <MessageCircleMore className="size-9" />
      </div>

      <Card className="w-full max-w-xs md:max-w-sm lg:max-w-md rounded-xs">
        <CardHeader>
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>Please enter your new password</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-1 mb-3">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1 mb-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div
              className="flex items-center gap-2 text-sm text-primary cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              {showPassword ? "Hide password" : "Show password"}
            </div>

            <Button
              type="submit"
              className="w-full my-3 rounded-xs"
              disabled={isPending}
            >
              {isPending ? (
                <Loader className="size-5 animate-spin text-white" />
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-primary font-medium">
            © All rights reserved to NexTalk
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordUi;

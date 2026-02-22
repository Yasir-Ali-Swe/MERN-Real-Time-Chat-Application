import React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MessageCircleMore, Mail } from "lucide-react";
import { Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { sendForgetPasswordEmail } from "../lib/auth-api";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const forgetPasswordRequest = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: sendForgetPasswordEmail,
    onSuccess: (response) => {
      toast.success(response.message || "Email sent successfully!");
      setFormData({ email: "" });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen px-3 lg:p-0">
      <div className="my-5 flex items-center justify-center gap-3">
        <h1 className="text-3xl font-bold">NexTalk</h1>
        <MessageCircleMore className="size-9" />
      </div>
      <Card className={"w-full max-w-xs md:max-w-sm lg:max-w-md rounded-xs"}>
        <CardHeader>
          <CardTitle className={"text-xl"}>Forget Password Request</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-1 my-3 relative">
              <Label htmlFor="email" className={"text-md"}>
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className={"rounded-xs"}
                value={formData.email}
                onChange={handleChange}
              />
              <div className="absolute right-3 top-9">
                <Label htmlFor="email">
                  <Mail className="size-5 text-primary cursor-pointer" />
                </Label>
              </div>
            </div>
            <div>
              <Link
                to="/auth/login"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Back to Login
              </Link>
            </div>
            <Button
              type="submit"
              className={"w-full my-3 rounded-xs cursor-pointer"}
            >
              {isPending ? (
                <Loader className="size-5 animate-spin text-white" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className={"flex justify-center items-center"}>
          <h1 className="text-primary font-medium">
            &copy; All rights reserved to NexTalk.
          </h1>
        </CardFooter>
      </Card>
    </div>
  );
};

export default forgetPasswordRequest;

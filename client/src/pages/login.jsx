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
import { Link } from "react-router-dom";
import { useState } from "react";
import { MessageCircleMore, Eye, EyeOff, Mail, Loader } from "lucide-react";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { login } from "../lib/auth-api";
import { setAccessToken } from "@/features/auth/auth-slice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      toast.success(response.data.message || "Login successful!");
      setFormData({ email: "", password: "" });
      const { accessToken } = response.data;
      dispatch(setAccessToken(accessToken));
      navigate("/");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error(error.response.data?.message || "Login failed!");
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
          <CardTitle className={"text-xl"}>Login</CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-1 mb-3 relative">
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
                <label htmlFor="email">
                  <Mail className="size-5 text-primary cursor-pointer" />
                </label>
              </div>
            </div>
            <div className="space-y-1 my-3 relative">
              <Label htmlFor="password" className={"text-md"}>
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                className={"rounded-xs"}
                onChange={handleChange}
              />
              <div className="absolute right-3 top-9">
                {showPassword ? (
                  <EyeOff
                    className="size-5 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <Eye
                    className="size-5 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            </div>
            <div>
              <Link
                to="/auth/forgot-password-request"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              className={"w-full my-3 rounded-xs cursor-pointer"}
            >
              {isPending ? (
                <Loader className="size-3 animate-spin text-white" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className={"flex justify-center items-center"}>
          <h1 className="text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-primary hover:underline">
              Register
            </Link>
          </h1>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

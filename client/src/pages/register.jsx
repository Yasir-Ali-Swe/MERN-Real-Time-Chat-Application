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
import {
  MessageCircleMore,
  Eye,
  EyeOff,
  SquareUserRound,
  Mail,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen px-3 lg:p-0">
      <div className="my-5 flex items-center justify-center gap-3">
        <h1 className="text-3xl font-bold">NexTalk</h1>
        <MessageCircleMore className="size-9" />
      </div>
      <Card className={"w-full max-w-xs md:max-w-sm lg:max-w-md rounded-xs"}>
        <CardHeader>
          <CardTitle className={"text-xl"}>Register</CardTitle>
          <CardDescription>Enter your credentials to register</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-1 mb-3 relative">
              <Label htmlFor="fullName" className={"text-md"}>
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                className={"rounded-xs"}
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
              <div className="absolute right-3 top-9">
                <Label htmlFor="fullName">
                  <SquareUserRound className="size-5 text-primary cursor-pointer" />
                </Label>
              </div>
            </div>
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
            <div className="space-y-1 my-3 relative">
              <Label htmlFor="password" className={"text-md"}>
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className={"rounded-xs"}
                placeholder="Enter your password"
                value={formData.password}
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
            <Button type="submit" className={"w-full my-3 rounded-xs cursor-pointer"}>
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className={"flex justify-center items-center"}>
          <h1 className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </h1>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;

import React from "react";
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
import { useState } from "react";
import { MessageCircleMore, EyeOff, Eye } from "lucide-react";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log(formData);
  };
  return (
    <>
      <div className="my-5 flex items-center justify-center gap-3">
        <h1 className="text-3xl font-bold">NexTalk</h1>
        <MessageCircleMore className="size-9" />
      </div>
      <Card className={"w-full max-w-xs md:max-w-sm lg:max-w-md rounded-xs"}>
        <CardHeader>
          <CardTitle className={"text-xl"}>Reset Password</CardTitle>
          <CardDescription>Please enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-1 mb-3">
              <Label htmlFor="password" className={"text-md"}>
                New Password
              </Label>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                className={"rounded-xs"}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1 my-3">
              <Label htmlFor="confirmPassword" className={"text-md"}>
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                className={"rounded-xs"}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div className="mt-3">
              {showPassword ? (
                <div className="flex items-center gap-2">
                  <h1 className="text-sm text-primary font-semibold">
                    Hide Password
                  </h1>
                  <EyeOff
                    className="size-5 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-sm text-primary font-semibold">
                    Show Password
                  </h1>
                  <Eye
                    className="size-5 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                </div>
              )}
            </div>
            <Button
              type="submit"
              className={"w-full my-3 rounded-xs cursor-pointer"}
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
        <CardFooter className={"flex justify-center items-center"}>
          <h1 className="text-primary font-medium">
            &copy; All rights reserved to NexTalk.
          </h1>
        </CardFooter>
      </Card>
    </>
  );
};

export default ResetPassword;

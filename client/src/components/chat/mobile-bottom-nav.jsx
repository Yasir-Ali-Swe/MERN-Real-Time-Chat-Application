import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SquareUser, MessageCircle } from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/features/auth/auth-slice";
import { logout } from "@/lib/auth-api";
import { toast } from "react-hot-toast";

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: logoutUser } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      toast.success(data?.message || "Logged out successfully");
      dispatch(logoutAction());
      navigate("/auth/login");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(message);
    },
  });

  const getVariant = (path) =>
    location.pathname.startsWith(path) ? "default" : "ghost";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t bg-background px-4 lg:hidden pb-safe">
      <Link to="/conversations">
        <Button
          size="icon"
          variant={getVariant("/conversations")}
          className="rounded-full"
        >
          <MessageCircle className="size-5" />
        </Button>
      </Link>

      <Link to="/friends">
        <Button
          size="icon"
          variant={getVariant("/friends")}
          className="rounded-full"
        >
          <SquareUser className="size-5" />
        </Button>
      </Link>

      <ModeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end">
          <DropdownMenuItem onClick={logoutUser}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileBottomNav;

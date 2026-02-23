import React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SquareUser, MessageCircle, MessageCircleMore } from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import { logout } from "@/lib/auth-api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/features/auth/auth-slice";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate: logoutUser } = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      toast.success(data.message || "Logged out successfully");
      dispatch(logoutAction());
      navigate("/auth/login");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(message);
      console.error("Logout error:", error);
    },
  });

  const renderTooltipButton = (icon, label, variant = "default") => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant={variant} className="rounded-sm">
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <Card className="flex h-full w-14 flex-col items-center justify-between rounded-none border-r bg-background p-2">
      <div className="flex flex-col items-center gap-4">
        {renderTooltipButton(
          <MessageCircleMore className="size-5" />,
          "NexTalk",
          "ghost",
        )}
        <div className="flex flex-col items-center gap-2">
          {renderTooltipButton(<SquareUser className="size-4" />, "Friends")}
          {renderTooltipButton(
            <MessageCircle className="size-4" />,
            "Conversations",
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuItem onClick={() => logoutUser()}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
};

export default Sidebar;

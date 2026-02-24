import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  SquareUser,
  MessageCircle,
  MessageCircleMore,
  UserPen,
  Mail,
  User,
  ImagePlus,
} from "lucide-react";
import { ModeToggle } from "@/components/toggle-theme";
import { logout } from "@/lib/auth-api";
import { updateProfileApi } from "@/lib/chat-api";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction, setUser } from "@/features/auth/auth-slice";
import { toast } from "react-hot-toast";
import FullScreenLoader from "@/components/ui/full-screen-loader";
import { createFormData } from "@/lib/file-utils";

const Sidebar = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatar: null,
  });
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        avatar: null,
      });
      setPreview(null);
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");
      dispatch(setUser(data.user));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile");
    },
  });

  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, avatar: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = () => {
    // Basic email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return toast.error("Invalid email format");
    }

    const fd = createFormData(formData);
    updateProfile(fd);
  };

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

  const getVariant = (path) =>
    location.pathname.startsWith(path) &&
    (path === "/friends" || path === "/conversations")
      ? "default"
      : "ghost";

  const renderTooltipButton = (icon, label, href, variant = "default") => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={href}>
          <Button size="icon" variant={variant} className="rounded-sm">
            {icon}
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <>
      {isUpdating && <FullScreenLoader message="Updating profile..." />}
      <Card className="flex h-full w-14 flex-col items-center justify-between rounded-none bg-background py-2 px-3">
        <div className="flex flex-col items-center gap-4">
          {renderTooltipButton(
            <MessageCircleMore className="size-5" />,
            "NexTalk",
            "/conversations",
            "ghost",
          )}
          <div className="flex flex-col items-center gap-2">
            {renderTooltipButton(
              <MessageCircle className="size-4" />,
              "Conversations",
              "/conversations",
              getVariant("/conversations"),
            )}

            {renderTooltipButton(
              <SquareUser className="size-4" />,
              "Friends",
              "/friends",
              getVariant("/friends"),
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Dialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button size="icon" variant="default">
                    <UserPen className="size-4" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Edit profile</TooltipContent>
            </Tooltip>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Update your personal information here.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar
                    className="size-24 mx-auto cursor-pointer"
                    onClick={() => !isUpdating && handleAvatarClick()}
                  >
                    {preview || user?.profilePicture ? (
                      <AvatarImage src={preview || user?.profilePicture} />
                    ) : (
                      <AvatarFallback>
                        <ImagePlus className="size-5 text-primary" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={isUpdating}
                  />
                </div>

                {/* Full name */}
                <div className="space-y-1 relative">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isUpdating}
                  />
                  <div className="absolute right-3 top-6.5">
                    <User className="size-5 text-primary" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1 relative">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isUpdating}
                  />
                  <div className="absolute right-3 top-6.5">
                    <Mail className="size-5 text-primary" />
                  </div>
                </div>

                {/* Actions */}
                <Button
                  onClick={handleUpdate}
                  className="w-full mt-2"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer border">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end">
              <DropdownMenuItem onClick={logoutUser}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </>
  );
};

export default Sidebar;

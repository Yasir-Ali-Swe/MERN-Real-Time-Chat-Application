import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Friends = ({ id, name, profilePicture }) => {
  return (
    <Link
      to={`/friends/${id}`}
      className="py-2 border-b hover:bg-accent cursor-pointer block"
    >
      <div className="flex items-center gap-2 px-2">
        <Avatar className="w-8 h-8 border">
          <AvatarImage src={profilePicture} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="truncate">{name}</span>
      </div>
    </Link>
  );
};

export default Friends;

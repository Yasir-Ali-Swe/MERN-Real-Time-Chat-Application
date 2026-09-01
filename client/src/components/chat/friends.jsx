import React from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Friends = ({ id, name, profilePicture }) => {
  const { id: activeId } = useParams();
  const isSelected = activeId === String(id);

  return (
    <Link
      to={`/friends/${id}`}
      className={`py-2 border-b hover:bg-accent cursor-pointer block ${isSelected ? "bg-card" : ""
        }`}
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

export default React.memo(Friends);

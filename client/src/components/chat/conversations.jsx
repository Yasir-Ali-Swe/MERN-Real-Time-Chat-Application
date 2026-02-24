import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Conversation = ({ id, name, unreadCount, lastMessage }) => {
  return (
    <Link
      to={`/conversations/${id}`}
      className="py-2 border-b hover:bg-accent cursor-pointer block"
    >
      <div className="flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${id || "user"}`} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate font-medium">{name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {lastMessage}
            </span>
          </div>
        </div>

        {unreadCount > 0 && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadCount}
          </div>
        )}
      </div>
    </Link>
  );
};

export default Conversation;

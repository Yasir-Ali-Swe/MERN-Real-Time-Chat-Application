import React from "react";
import { Link } from "react-router-dom";
import {
  AvatarWithPresence,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const Conversation = ({
  id,
  name,
  unreadCount,
  lastMessage,
  profilePicture,
  isTyping,
  isOnline,
}) => {
  const secondaryText = isTyping ? "typing..." : lastMessage;
  const secondaryClass = isTyping ? "text-amber-500" : "text-muted-foreground";

  return (
    <Link
      to={`/conversations/${id}`}
      className="py-2 border-b hover:bg-accent cursor-pointer block"
    >
      <div className="flex items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <AvatarWithPresence
            isOnline={isOnline}
            className="w-8.5 h-8.5 shrink-0 border"
          >
            <AvatarImage src={profilePicture} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </AvatarWithPresence>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate font-medium">{name}</span>
            <span className={`truncate text-xs ${secondaryClass}`}>
              {secondaryText}
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

export default React.memo(Conversation);

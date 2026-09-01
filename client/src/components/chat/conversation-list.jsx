import React from "react";
import Conversation from "./conversations";
import { useQuery } from "@tanstack/react-query";
import { getUserConversations } from "@/lib/chat-api";
import FullScreenLoader from "@/components/ui/full-screen-loader";
import { useSocket } from "@/context/SocketContext";
import { SquareUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ConversationList = () => {
  const { onlineUsers, typingUsers } = useSocket();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
  });

  const conversations = data?.conversations || [];

  return (
    <>
      {isLoading && <FullScreenLoader message="Loading conversations..." />}
      <div className="h-full w-full">
        <div className="flex items-center justify-between p-2 border-b">
          <h1 className="text-xl font-semibold">Conversations</h1>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/friends">
              <SquareUser className="size-4" />
            </Link>
          </Button>
        </div>

        {isError ? (
          <div className="text-center text-red-500 mt-4">
            Failed to load conversations.
          </div>
        ) : (
          <div className="flex flex-col">
            {!isLoading &&
              conversations.map((conv) => {
                const otherParticipant = conv.participants[0] || {};
                const participantId = String(otherParticipant._id || "");
                const isTyping = Boolean(typingUsers?.[participantId]);
                const isOnline = onlineUsers.some(
                  (onlineId) => String(onlineId) === participantId,
                );

                const previewText = conv.lastMessage?.text
                  ? conv.lastMessage.text
                  : conv.lastMessage?.image
                    ? "Photo"
                    : "New conversation started...";

                return (
                  <Conversation
                    key={conv._id}
                    id={otherParticipant._id}
                    name={otherParticipant.fullName || "Unknown"}
                    profilePicture={otherParticipant.profilePicture}
                    unreadCount={conv.unreadCount}
                    lastMessage={previewText}
                    isTyping={isTyping}
                    isOnline={isOnline}
                  />
                );
              })}
            {!isLoading && conversations.length === 0 && (
              <h1 className="text-center text-muted-foreground mt-4">
                No conversation found.
              </h1>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ConversationList;

import React from "react";
import Conversation from "./conversations";
import { useQuery } from "@tanstack/react-query";
import { getUserConversations } from "@/lib/chat-api";
import FullScreenLoader from "@/components/ui/full-screen-loader";

const ConversationList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
  });

  const conversations = data?.conversations || [];

  return (
    <>
      {isLoading && <FullScreenLoader message="Loading conversations..." />}
      <div className="h-full w-full">
        <h1 className="text-xl font-semibold m-2">Conversations</h1>

        {isError ? (
          <div className="text-center text-red-500 mt-4">
            Failed to load conversations.
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
            {!isLoading &&
              conversations.map((conv) => {
                const otherParticipant = conv.participants[0] || {};
                return (
                  <Conversation
                    key={conv._id}
                    id={otherParticipant._id}
                    name={otherParticipant.fullName || "Unknown"}
                    profilePicture={otherParticipant.profilePicture}
                    unreadCount={conv.unreadCount}
                    lastMessage={
                      conv.lastMessage?.text || "New conversation started..."
                    }
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

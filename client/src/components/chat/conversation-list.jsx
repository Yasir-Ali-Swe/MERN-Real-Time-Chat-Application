import React from "react";
import { Link } from "react-router-dom";

const ConversationList = () => {
  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-semibold m-2">Conversations</h1>
      <div className="flex flex-col gap-2 p-2">
        <Link
          to="/conversations/1"
          className="p-3 border rounded-md hover:bg-accent cursor-pointer block"
        >
          Conversation 1
        </Link>
        <Link
          to="/conversations/2"
          className="p-3 border rounded-md hover:bg-accent cursor-pointer block"
        >
          Conversation 2
        </Link>
        <h1 className="text-center text-muted-foreground mt-4">
          No other conversation found.
        </h1>
      </div>
    </div>
  );
};

export default ConversationList;

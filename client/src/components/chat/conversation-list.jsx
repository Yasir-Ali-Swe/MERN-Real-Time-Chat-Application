import React from "react";
import Conversation from "./conversations";

const conversations = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
  { id: 4, name: "Alice Brown" },
];

const ConversationList = () => {
  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-semibold m-2">Conversations</h1>
      <div className="flex flex-col gap-2 p-2">
        {conversations.map((conversation) => (
          <Conversation
            key={conversation.id}
            id={conversation.id}
            name={conversation.name}
          />
        ))}
        <h1 className="text-center text-muted-foreground mt-4">
          No other conversation found.
        </h1>
      </div>
    </div>
  );
};

export default ConversationList;

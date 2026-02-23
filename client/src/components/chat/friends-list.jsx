import React from "react";
import Friends from "./friends";

const friend = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
  { id: 4, name: "Alice Brown" },
];

const FriendsList = () => {
  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-semibold m-2">Friends</h1>
      <div className="flex flex-col gap-2 p-2">
        {friend.map((f) => (
          <Friends key={f.id} id={f.id} name={f.name} />
        ))}
        <h1 className="text-center text-muted-foreground mt-4">
          No other friends found.
        </h1>
      </div>
    </div>
  );
};

export default FriendsList;

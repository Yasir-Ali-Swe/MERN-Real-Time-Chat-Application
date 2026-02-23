import React from "react";
import { Link } from "react-router-dom";

const FriendsList = () => {
  return (
    <div className="h-full w-full">
      <h1 className="text-xl font-semibold m-2">Friends</h1>
      <div className="flex flex-col gap-2 p-2">
        <Link
          to="/friends/3"
          className="p-3 border rounded-md hover:bg-accent cursor-pointer block"
        >
          Friend 1
        </Link>
        <h1 className="text-center text-muted-foreground mt-4">
          No other friends found.
        </h1>
      </div>
    </div>
  );
};

export default FriendsList;

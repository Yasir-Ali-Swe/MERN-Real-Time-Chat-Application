import React from "react";
import Friends from "./friends";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/chat-api";
import FullScreenLoader from "@/components/ui/full-screen-loader";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
const FriendsList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const users = data?.users || [];

  return (
    <>
      {isLoading && <FullScreenLoader message="Loading friends..." />}
      <div className="h-full w-full">
        <div className="flex items-center justify-between p-2 border-b">
          <h1 className="text-xl font-semibold">Friends</h1>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/conversations">
              <MessageCircle className="size-4" />
            </Link>
          </Button>
        </div>

        {isError ? (
          <div className="text-center text-red-500 mt-4">
            Failed to load friends.
          </div>
        ) : (
          <div className="flex flex-col">
            {!isLoading &&
              users.map((f) => (
                <Friends
                  key={f._id}
                  id={f._id}
                  name={f.fullName}
                  profilePicture={f.profilePicture}
                />
              ))}
            {!isLoading && users.length === 0 && (
              <h1 className="text-center text-muted-foreground mt-4">
                No friends found.
              </h1>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FriendsList;

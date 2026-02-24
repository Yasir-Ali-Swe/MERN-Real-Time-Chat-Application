import React from "react";
import Friends from "./friends";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/chat-api";
import FullScreenLoader from "@/components/ui/full-screen-loader";

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
        <h1 className="text-xl font-semibold m-2">Friends</h1>

        {isError ? (
          <div className="text-center text-red-500 mt-4">
            Failed to load friends.
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-2">
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

import React from "react";
import { Loader } from "lucide-react";

const FullScreenLoader = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm">
      <Loader
        className="size-10 animate-spin text-primary"
        aria-label="Loading"
      />
      {message && (
        <p className="mt-4 text-lg font-medium text-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default FullScreenLoader;

import React from "react";
import toast from "react-hot-toast";

const App = () => {
  const showToast = () => {
    toast.success("This is a success toast!");
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-300">
      <h1 className="text-3xl text-red-500 underline font-bold">
        Welcome to the Chat App
      </h1>
      <div className="my-2 flex gap-3">
        <button onClick={showToast} className="btn btn-neutral">Neutral</button>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-accent">Accent</button>
        <button className="btn btn-info">Info</button>
        <button className="btn btn-success">Success</button>
        <button className="btn btn-warning">Warning</button>
        <button className="btn btn-error">Error</button>
      </div>
    </div>
  );
};

export default App;

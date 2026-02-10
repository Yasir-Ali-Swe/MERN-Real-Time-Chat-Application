import React from "react";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import Pikaday from "pikaday";

const App = () => {
  const myDatepicker = useRef(null);
  useEffect(() => {
    const picker = new Pikaday({
      field: myDatepicker.current,
    });
    return () => picker.destroy();
  }, []);
  const showToast = () => {
    toast.success("This is a success toast!");
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-300">
      <h1 className="text-3xl text-red-500 underline font-bold">
        Welcome to the Chat App
      </h1>
      <div className="my-2 flex gap-3">
        <button onClick={showToast} className="btn btn-dash btn-neutral">
          Neutral
        </button>
        <button className="btn btn-dash btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-accent">Accent</button>
        <button className="btn btn-info">Info</button>
        <button className="btn btn-success">Success</button>
        <button className="btn btn-warning">Warning</button>
        <button className="btn btn-error">Error</button>
      </div>
      <input
        type="text"
        className="input pika-single"
        defaultValue="Pick a date"
        ref={myDatepicker}
      />
    </div>
  );
};

export default App;

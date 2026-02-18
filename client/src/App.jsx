import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import Pikaday from "pikaday";
import { X } from "lucide-react";

const App = () => {
  const myDatepicker = useRef(null);
  useEffect(() => {
    const picker = new Pikaday({
      field: myDatepicker.current,
    });
    return () => picker.destroy();
  }, []);
  const successToast = () => {
    toast.success("This is a success toast!");
  };
  const errorToast = () => {
    toast.error("This is an error toast!");
  };
  const warningToast = () => {
    toast(
      <div className="text-yellow-800 rounded flex justify-between items-center gap-10">
        <p>⚠️ This is a warning toast!</p>
        <button onClick={(t) => toast.dismiss(t.id)} className="cursor-pointer bg-red-500 text-white rounded-full p-0.5 text-center">
          <X className="size-5 font-black"/>
        </button>
      </div>,
    );
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-gray-300">
      <h1 className="text-3xl text-red-500 underline font-bold">
        Welcome to the Chat App
      </h1>
      <div className="my-2 flex gap-3">
        <button className="btn btn-dash btn-neutral">Neutral</button>
        <button className="btn btn-dash btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-accent">Accent</button>
        <button className="btn btn-info">Info</button>
        <button onClick={successToast} className="btn btn-success">
          Success
        </button>
        <button onClick={warningToast} className="btn btn-warning">
          Warning
        </button>
        <button onClick={errorToast} className="btn btn-error">
          Error
        </button>
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

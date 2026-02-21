import toast from "react-hot-toast";
import { X } from "lucide-react";
import { Button } from "./components/ui/button";
const App = () => {
  const successToast = () => {
    toast.success("This is a success toast!");
  };
  const errorToast = () => {
    toast.error("This is an error toast!");
  };
  const warningToast = () => {
    toast((t) => (
      <div className="text-yellow-800 rounded flex justify-between items-center gap-10">
        <p>⚠️ This is a warning toast!</p>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="cursor-pointer bg-red-500 text-white rounded-full p-0.5 text-center"
        >
          <X className="size-5 font-black" />
        </button>
      </div>
    ));
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-screen bg-muted-foreground">
      <h1 className="text-3xl text-destructive underline font-bold">
        Welcome to the Chat App
      </h1>
      <div className="my-2 flex gap-3">
        <Button variant="default" onClick={successToast}>Success</Button>
        <Button variant="destructive" onClick={errorToast}>Error</Button>
        <Button variant="outline" onClick={warningToast}>Warning</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  );
};

export default App;

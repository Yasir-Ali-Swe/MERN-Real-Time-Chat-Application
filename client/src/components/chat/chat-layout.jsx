import { Outlet } from "react-router-dom";
import Sidebar from "@/components/chat/sidebar";

const ChatLayout = () => {
  return (
    <div className="flex h-screen gap-1 px-2 py-1">
      <Sidebar />
      <div className="flex flex-1 gap-1">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;

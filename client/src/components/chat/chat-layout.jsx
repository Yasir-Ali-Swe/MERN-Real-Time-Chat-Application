import { Outlet } from "react-router-dom";
import Sidebar from "@/components/chat/sidebar";
import MobileBottomNav from "@/components/chat/mobile-bottom-nav";

const ChatLayout = () => {
  return (
    <div className="flex h-screen flex-col lg:flex-row gap-1 p-1  pb-16 lg:pb-1 relative">
      <div className="hidden lg:flex">
        <Sidebar />
      </div>
      <div className="flex flex-1 gap-1 overflow-hidden">
        <Outlet />
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default ChatLayout;

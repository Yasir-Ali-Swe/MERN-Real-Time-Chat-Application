import { Outlet } from "react-router-dom";
import ConversationPlaceholder from "@/components/chat/conversation-placeholder";

const ConversationLayout = () => {
  return (
    <>
      <div className="w-72 border">
        <Outlet />
      </div>
      <div className="flex flex-1">
        <ConversationPlaceholder />
      </div>
    </>
  );
};

export default ConversationLayout;
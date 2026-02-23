import { Outlet, useParams } from "react-router-dom";

const ConversationLayout = ({ leftPanel }) => {
  const { id } = useParams();
  const isChatActive = !!id;

  return (
    <>
      <div
        className={`w-full lg:w-72 border h-full overflow-hidden ${isChatActive ? "hidden lg:block" : "block"}`}
      >
        {leftPanel}
      </div>
      <div
        className={`flex-1 h-full ${isChatActive ? "flex" : "hidden lg:flex"}`}
      >
        <Outlet />
      </div>
    </>
  );
};

export default ConversationLayout;

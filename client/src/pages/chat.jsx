import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, ImagePlus, X, Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversationMessages,
  sendMessageApi,
  markAsReadApi,
  getUsers,
  getUserConversations,
} from "@/lib/chat-api";
import { useSelector } from "react-redux";
import FullScreenLoader from "@/components/ui/full-screen-loader";
import { createFormData, handleImagePreview } from "@/lib/file-utils";
import { useChatSocket } from "@/hooks/useChatSocket";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers } = useChatSocket(id);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const { data: convData } = useQuery({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
  });

  let chatUserName = "User";
  let avatarFallback = "U";
  let profilePicture = null;

  if (usersData?.users) {
    const foundUser = usersData.users.find((u) => u._id === id);
    if (foundUser) {
      chatUserName = foundUser.fullName;
      avatarFallback = foundUser.fullName.charAt(0).toUpperCase();
      profilePicture = foundUser.profilePicture;
    }
  }
  if (chatUserName === "User" && convData?.conversations) {
    const foundConv = convData.conversations.find((c) =>
      c.participants.some((p) => p?._id === id),
    );
    if (foundConv) {
      const participant = foundConv.participants.find((p) => p?._id === id);
      if (participant) {
        chatUserName = participant.fullName || "User";
        avatarFallback = chatUserName.charAt(0).toUpperCase();
        profilePicture = participant.profilePicture;
      }
    }
  }

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getConversationMessages(id),
    enabled: !!id,
  });

  const messages = messagesData?.messages || [];

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: sendMessageApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["messages", id], (old) => {
        if (!old) return { messages: [data.data] };
        return { ...old, messages: [...old.messages, data.data] };
      });
      setText("");
      setImageFile(null);
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (isSending) return;
    if (text.trim() || imageFile) {
      const payload = {
        receiverId: id,
        text: text.trim() ? text : null,
        image: imageFile ? imageFile : null,
      };
      sendMessage(createFormData(payload));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      handleImagePreview(file, setImagePreview);
    }
  };

  return (
    <>
      {isLoading && <FullScreenLoader message="Loading messages..." />}
      <div className="flex h-full w-full flex-col bg-background border">
        <div className="flex h-14 shrink-0 items-center border-b px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <Avatar className="h-8 w-8 mr-3 border">
            <AvatarImage src={profilePicture} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="font-semibold truncate max-w-[200px]">
            {chatUserName}
          </div>
        </div>
        <div className="hidden h-14 shrink-0 items-center border-b px-4 lg:flex">
          <Avatar className="h-8 w-8 mr-3 border">
            <AvatarImage src={profilePicture} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="font-semibold truncate max-w-[200px]">
            {chatUserName}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {!isLoading && messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-4 mb-auto">
              Say hi to start the conversation!
            </div>
          )}
          {!isLoading &&
            messages.length > 0 &&
            messages.map((msg, index) => {
              const isMe = String(msg.senderId) === String(user?._id);
              const messageDate = new Date(msg.createdAt);
              const formattedDate = messageDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const formattedTime = messageDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={index}
                  className={`flex flex-col mb-1 ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 flex flex-col ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="attachment"
                        className={`max-h-[200px] max-w-[200px] object-cover rounded-md ${msg.text ? "mb-2" : ""}`}
                      />
                    )}
                    {msg.text && <div>{msg.text}</div>}
                  </div>
                  <div
                    className={`text-[10px] mt-1 text-muted-foreground ${isMe ? "mr-1" : "ml-1"}`}
                  >
                    {formattedDate} {formattedTime}
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>

        {imagePreview && (
          <div className="p-3 border-t bg-muted relative">
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 left-20 h-6 w-6 rounded-full cursor-pointer"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={imagePreview}
              alt="preview"
              className="h-20 w-20 object-cover rounded-md border"
            />
          </div>
        )}

        <div className="border-t shrink-0 p-3 flex items-center gap-2">
          <Input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="size-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            className="flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={(!text.trim() && !imageFile) || isSending}
          >
            {isSending ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

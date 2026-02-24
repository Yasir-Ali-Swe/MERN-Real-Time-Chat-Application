import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
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
import { useSocket } from "@/context/SocketContext";
import { useSelector } from "react-redux";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { user } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

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

  if (usersData?.users) {
    const foundUser = usersData.users.find((u) => u._id === id);
    if (foundUser) {
      chatUserName = foundUser.fullName;
      avatarFallback = foundUser.fullName.charAt(0).toUpperCase();
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
      }
    }
  }

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getConversationMessages(id),
    enabled: !!id,
  });

  const messages = messagesData?.messages || [];

  const { mutate: sendMessage } = useMutation({
    mutationFn: sendMessageApi,
    onSuccess: (data) => {
      queryClient.setQueryData(["messages", id], (old) => {
        if (!old) return { messages: [data.data] };
        return { ...old, messages: [...old.messages, data.data] };
      });
      setText("");
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  useEffect(() => {
    if (id) {
      markAsReadApi(id)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
        })
        .catch(console.error);
    }
  }, [id, queryClient, messages.length]);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      if (newMessage.senderId === id) {
        queryClient.setQueryData(["messages", id], (old) => {
          if (!old) return { messages: [newMessage] };
          return { ...old, messages: [...old.messages, newMessage] };
        });
        markAsReadApi(id)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
          })
          .catch(console.error);
      } else {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, id, queryClient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (text.trim()) {
      sendMessage({ receiverId: id, text });
    }
  };

  return (
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
        <Avatar className="h-8 w-8 mr-3">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${id || "user"}`} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="font-semibold truncate max-w-[200px]">
          {chatUserName}
        </div>
      </div>
      <div className="hidden h-14 shrink-0 items-center border-b px-4 lg:flex">
        <Avatar className="h-8 w-8 mr-3">
          <AvatarImage src={`https://i.pravatar.cc/150?u=${id || "user"}`} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="font-semibold truncate max-w-[200px]">
          {chatUserName}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="text-center text-muted-foreground mt-4 mb-auto">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground mt-4 mb-auto">
            Say hi to start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = String(msg.senderId) === String(user?._id);
            return (
              <div
                key={index}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t shrink-0 p-3 flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          className="flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button size="icon" onClick={handleSend} disabled={!text.trim()}>
          <Send className="size-4" />
        </Button>
      </div>
    </div>
  );
}

import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Send,
  ImagePlus,
  X,
  Loader,
  Clock3,
  Check,
  CheckCheck,
  CircleAlert,
} from "lucide-react";
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
import { getUserPresenceStatus } from "@/lib/user-status";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  const { socket, onlineUsers, typingUsers, lastSeenUsers } = useChatSocket(id);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const pendingMessagesRef = useRef(new Map());

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
  let chatLastSeenAt = null;

  if (usersData?.users) {
    const foundUser = usersData.users.find((u) => u._id === id);
    if (foundUser) {
      chatUserName = foundUser.fullName;
      avatarFallback = foundUser.fullName.charAt(0).toUpperCase();
      profilePicture = foundUser.profilePicture;
      chatLastSeenAt = foundUser.lastSeenAt;
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
        chatLastSeenAt = participant.lastSeenAt;
      }
    }
  }

  const headerPresence = getUserPresenceStatus({
    userId: id,
    onlineUsers,
    typingUsers,
    lastSeenAt:
      lastSeenUsers?.[id] || chatLastSeenAt || null,
  });

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => getConversationMessages(id),
    enabled: !!id,
  });

  const messages = messagesData?.messages || [];

  const updateMessageCache = (updater) => {
    queryClient.setQueryData(["messages", id], (old) => {
      const current = old?.messages || [];
      return {
        ...(old || {}),
        messages: updater(current),
      };
    });
  };

  const { mutate: sendMessage, isPending: isSending } = useMutation({
    mutationFn: sendMessageApi,
    onMutate: async (formData) => {
      const tempId = formData.get("tempId");
      const draft = pendingMessagesRef.current.get(String(tempId));

      if (!draft) return { tempId: null };

      await queryClient.cancelQueries({ queryKey: ["messages", id] });

      const optimisticMessage = {
        _id: tempId,
        tempId,
        conversationId: draft.receiverId,
        senderId: user?._id,
        receiverId: draft.receiverId,
        text: draft.text,
        image: draft.imagePreview || "",
        read: false,
        status: "sending",
        createdAt: new Date().toISOString(),
      };

      updateMessageCache((current) => {
        const exists = current.some(
          (message) =>
            String(message._id) === String(optimisticMessage._id) ||
            (optimisticMessage.tempId && String(message.tempId) === String(optimisticMessage.tempId)),
        );

        if (exists) {
          return current.map((message) =>
            String(message.tempId) === String(optimisticMessage.tempId)
              ? { ...message, ...optimisticMessage, status: "sending" }
              : message,
          );
        }

        return [...current, optimisticMessage];
      });

      return { tempId };
    },
    onSuccess: (data) => {
      const confirmedMessage = data.data;
      if (!confirmedMessage) return;

      pendingMessagesRef.current.delete(String(confirmedMessage.tempId || ""));

      updateMessageCache((current) => {
        const confirmedTempId = confirmedMessage.tempId;
        const exists = current.some(
          (message) =>
            String(message._id) === String(confirmedMessage._id) ||
            (confirmedTempId && String(message.tempId) === String(confirmedTempId)),
        );

        if (exists) {
          return current.map((message) =>
            confirmedTempId && String(message.tempId) === String(confirmedTempId)
              ? { ...confirmedMessage, status: confirmedMessage.status || "sent" }
              : message,
          );
        }

        return [...current, { ...confirmedMessage, status: confirmedMessage.status || "sent" }];
      });

      setText("");
      setImageFile(null);
      setImagePreview(null);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (_error, _variables, context) => {
      if (!context?.tempId) return;

      updateMessageCache((current) =>
        current.map((message) =>
          String(message.tempId) === String(context.tempId)
            ? { ...message, status: "failed" }
            : message,
        ),
      );
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (socket && id && isTypingRef.current) {
        socket.emit("stop_typing", { receiverId: id });
      }
    };
  }, [socket, id]);

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (socket && id && isTypingRef.current) {
      socket.emit("stop_typing", { receiverId: id });
    }

    isTypingRef.current = false;
  };

  const startTyping = () => {
    if (!socket || !id) return;

    if (!isTypingRef.current) {
      socket.emit("typing", { receiverId: id });
      isTypingRef.current = true;
    } else {
      socket.emit("typing", { receiverId: id });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1500);
  };

  const handleSend = () => {
    if (isSending) return;
    if (text.trim() || imageFile) {
      const trimmedText = text.trim();
      const tempId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      pendingMessagesRef.current.set(tempId, {
        receiverId: id,
        text: trimmedText,
        image: imageFile,
        imagePreview,
      });

      const payload = {
        receiverId: id,
        text: trimmedText || null,
        image: imageFile ? imageFile : null,
        tempId,
      };

      stopTyping();
      setText("");
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (socket) {
        socket.emit("send_message", {
          receiverId: id,
          tempId,
        });
      }

      sendMessage(createFormData(payload));
    }
  };

  const handleRetry = (tempId) => {
    const pending = pendingMessagesRef.current.get(String(tempId));
    if (!pending) return;

    const payload = {
      receiverId: pending.receiverId,
      text: pending.text ? pending.text : null,
      image: pending.image || null,
      tempId,
    };

    sendMessage(createFormData(payload));
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
          <div className="min-w-0 flex flex-col">
            <div className="font-semibold truncate max-w-50">
              {chatUserName}
            </div>
            <div
              className={`truncate text-xs ${
                headerPresence.type === "typing"
                  ? "text-amber-500"
                  : headerPresence.type === "online"
                    ? "text-emerald-500"
                    : "text-muted-foreground"
              }`}
            >
              {headerPresence.text}
            </div>
          </div>
        </div>
        <div className="hidden h-14 shrink-0 items-center border-b px-4 lg:flex">
          <Avatar className="h-8 w-8 mr-3 border">
            <AvatarImage src={profilePicture} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex flex-col">
            <div className="font-semibold truncate max-w-50">
              {chatUserName}
            </div>
            <div
              className={`truncate text-xs ${
                headerPresence.type === "typing"
                  ? "text-amber-500"
                  : headerPresence.type === "online"
                    ? "text-emerald-500"
                    : "text-muted-foreground"
              }`}
            >
              {headerPresence.text}
            </div>
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
              const messageStatus = msg.status || (msg.tempId ? "sending" : "sent");

              return (
                <div
                  key={msg._id || msg.tempId || index}
                  className={`flex flex-col mb-1 ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg p-3 flex flex-col ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                  >
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="attachment"
                        className={`max-h-50 max-w-50 object-cover rounded-md ${msg.text ? "mb-2" : ""}`}
                      />
                    )}
                    {msg.text && <div>{msg.text}</div>}
                  </div>
                  <div className={`mt-1 flex items-center gap-1 text-[10px] ${isMe ? "mr-1 justify-end" : "ml-1 justify-start"}`}>
                    <span className="text-muted-foreground">
                      {formattedDate} {formattedTime}
                    </span>
                    {isMe && messageStatus === "sending" && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock3 className="size-3 animate-pulse" /> sending
                      </span>
                    )}
                    {isMe && messageStatus === "sent" && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Check className="size-3" />
                      </span>
                    )}
                    {isMe && messageStatus === "delivered" && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <CheckCheck className="size-3" />
                      </span>
                    )}
                    {isMe && messageStatus === "seen" && (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckCheck className="size-3" />
                      </span>
                    )}
                    {isMe && messageStatus === "failed" && (
                      <button
                        type="button"
                        onClick={() => handleRetry(msg.tempId)}
                        className="flex items-center gap-1 text-red-500 hover:underline"
                      >
                        <CircleAlert className="size-3" /> failed - retry
                      </button>
                    )}
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
            onChange={(e) => {
              const value = e.target.value;
              setText(value);

              if (value.trim()) {
                startTyping();
              } else {
                stopTyping();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
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

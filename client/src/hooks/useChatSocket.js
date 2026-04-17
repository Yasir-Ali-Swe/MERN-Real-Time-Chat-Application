import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { markAsReadApi } from "@/lib/chat-api";

export const useChatSocket = (activeConversationId) => {
    const { socket, onlineUsers, typingUsers, lastSeenUsers } = useSocket();
    const queryClient = useQueryClient();

    const emitMarkAsSeen = () => {
        if (!socket || !activeConversationId) return;
        socket.emit("mark_as_seen", { conversationId: activeConversationId });
    };

    // Mark as read when entering a conversation
    useEffect(() => {
        if (activeConversationId) {
            markAsReadApi(activeConversationId)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ["conversations"] });
                    emitMarkAsSeen();
                })
                .catch(console.error);
        }
    }, [activeConversationId, queryClient, socket]);

    useEffect(() => {
        if (!socket || !activeConversationId) return;

        const handleWindowFocus = () => {
            emitMarkAsSeen();
            markAsReadApi(activeConversationId)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ["conversations"] });
                })
                .catch(console.error);
        };

        window.addEventListener("focus", handleWindowFocus);

        return () => {
            window.removeEventListener("focus", handleWindowFocus);
        };
    }, [socket, activeConversationId, queryClient]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage) => {
            // If the message is from the currently active chat
            if (
                activeConversationId &&
                String(newMessage.senderId) === String(activeConversationId)
            ) {
                queryClient.setQueryData(["messages", activeConversationId], (old) => {
                    const messages = old?.messages || [];
                    const exists = messages.some(
                        (message) =>
                            String(message._id) === String(newMessage._id) ||
                            (newMessage.tempId && String(message.tempId) === String(newMessage.tempId)),
                    );

                    if (exists) {
                        return {
                            ...old,
                            messages: messages.map((message) =>
                                newMessage.tempId && String(message.tempId) === String(newMessage.tempId)
                                    ? {
                                        ...newMessage,
                                        tempId: newMessage.tempId,
                                        status: newMessage.status || message.status,
                                    }
                                    : message,
                            ),
                        };
                    }

                    return { ...old, messages: [...messages, newMessage] };
                });

                // Immediately mark it as read and clear unread bubble in sidebar
                markAsReadApi(activeConversationId)
                    .then(() => {
                        queryClient.invalidateQueries({ queryKey: ["conversations"] });
                        emitMarkAsSeen();
                    })
                    .catch(console.error);
            } else {
                // If from someone else, just quietly invalidate to bump unread notification
                queryClient.invalidateQueries({ queryKey: ["conversations"] });
            }
        };

        const handleMessageConfirmed = (confirmedMessage) => {
            if (!activeConversationId) return;
            if (String(confirmedMessage.receiverId) !== String(activeConversationId)) return;

            queryClient.setQueryData(["messages", activeConversationId], (old) => {
                const messages = old?.messages || [];
                const hasTempMatch = confirmedMessage.tempId
                    ? messages.some((message) => String(message.tempId) === String(confirmedMessage.tempId))
                    : false;

                if (!hasTempMatch && messages.some((message) => String(message._id) === String(confirmedMessage._id))) {
                    return old;
                }

                if (hasTempMatch) {
                    return {
                        ...old,
                        messages: messages.map((message) =>
                            String(message.tempId) === String(confirmedMessage.tempId)
                                ? { ...confirmedMessage, status: confirmedMessage.status || "sent" }
                                : message,
                        ),
                    };
                }

                return {
                    ...old,
                    messages: [...messages, { ...confirmedMessage, status: confirmedMessage.status || "sent" }],
                };
            });
        };

        const handleMessageDelivered = (payload) => {
            if (!payload?._id || !activeConversationId) return;

            queryClient.setQueryData(["messages", activeConversationId], (old) => {
                const messages = old?.messages || [];
                return {
                    ...old,
                    messages: messages.map((message) =>
                        String(message._id) === String(payload._id)
                            ? {
                                ...message,
                                status: "delivered",
                                deliveredAt: payload.deliveredAt || message.deliveredAt,
                            }
                            : message,
                    ),
                };
            });
        };

        const handleMessageSeen = (payload) => {
            if (!payload?._id || !activeConversationId) return;

            queryClient.setQueryData(["messages", activeConversationId], (old) => {
                const messages = old?.messages || [];
                return {
                    ...old,
                    messages: messages.map((message) =>
                        String(message._id) === String(payload._id)
                            ? {
                                ...message,
                                status: "seen",
                                seenAt: payload.seenAt || message.seenAt,
                            }
                            : message,
                    ),
                };
            });
        };

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("receive_message", handleReceiveMessage);
        socket.on("message_confirmed", handleMessageConfirmed);
        socket.on("message_delivered", handleMessageDelivered);
        socket.on("message_seen", handleMessageSeen);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("receive_message", handleReceiveMessage);
            socket.off("message_confirmed", handleMessageConfirmed);
            socket.off("message_delivered", handleMessageDelivered);
            socket.off("message_seen", handleMessageSeen);
        };
    }, [socket, activeConversationId, queryClient]);

    return { socket, onlineUsers, typingUsers, lastSeenUsers };
};

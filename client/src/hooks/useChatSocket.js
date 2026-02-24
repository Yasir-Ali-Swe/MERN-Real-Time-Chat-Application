import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { markAsReadApi } from "@/lib/chat-api";

export const useChatSocket = (activeConversationId) => {
    const { socket, onlineUsers } = useSocket();
    const queryClient = useQueryClient();

    // Mark as read when entering a conversation
    useEffect(() => {
        if (activeConversationId) {
            markAsReadApi(activeConversationId)
                .then(() => {
                    queryClient.invalidateQueries({ queryKey: ["conversations"] });
                })
                .catch(console.error);
        }
    }, [activeConversationId, queryClient]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (newMessage) => {
            // If the message is from the currently active chat
            if (activeConversationId && newMessage.senderId === activeConversationId) {
                queryClient.setQueryData(["messages", activeConversationId], (old) => {
                    if (!old) return { messages: [newMessage] };
                    return { ...old, messages: [...old.messages, newMessage] };
                });

                // Immediately mark it as read and clear unread bubble in sidebar
                markAsReadApi(activeConversationId)
                    .then(() => {
                        queryClient.invalidateQueries({ queryKey: ["conversations"] });
                    })
                    .catch(console.error);
            } else {
                // If from someone else, just quietly invalidate to bump unread notification
                queryClient.invalidateQueries({ queryKey: ["conversations"] });
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };
    }, [socket, activeConversationId, queryClient]);

    return { socket, onlineUsers };
};

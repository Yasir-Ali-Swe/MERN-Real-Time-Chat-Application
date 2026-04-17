import { Server } from "socket.io";
import http from "http";
import express from "express";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import conversationModel from "../models/conversation.model.js";
import messagesModel from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    },
});

const userSocketMap = new Map(); // userId -> Set<socketId>
const socketUserMap = new Map(); // socketId -> userId
const typingTargetsMap = new Map(); // userId -> Set<receiverId>

export const getReceiverSocketId = (receiverId) => {
    const sockets = userSocketMap.get(String(receiverId));
    if (!sockets?.size) return undefined;
    return sockets.values().next().value;
};

export const getReceiverSocketIds = (receiverId) => {
    const sockets = userSocketMap.get(String(receiverId));
    return sockets ? Array.from(sockets) : [];
};

const getConnectedUserIds = () => Array.from(userSocketMap.keys());

const clearTypingState = (userId, receiverId) => {
    const userKey = String(userId);
    const receiverKey = String(receiverId);
    const targets = typingTargetsMap.get(userKey);

    if (!targets) return;

    targets.delete(receiverKey);
    if (targets.size === 0) {
        typingTargetsMap.delete(userKey);
    }
};

const rememberTypingTarget = (userId, receiverId) => {
    const userKey = String(userId);
    const receiverKey = String(receiverId);
    const targets = typingTargetsMap.get(userKey) || new Set();
    targets.add(receiverKey);
    typingTargetsMap.set(userKey, targets);
};

const markUserOffline = async (userId) => {
    try {
        await User.findByIdAndUpdate(userId, {
            lastSeenAt: new Date(),
        });
    } catch (error) {
        console.error("Failed to update lastSeenAt:", error);
    }
};

const markPendingMessagesAsDelivered = async (userId) => {
    const now = new Date();
    const pendingMessages = await messagesModel.find({
        receiverId: userId,
        status: "sent",
    });

    if (pendingMessages.length === 0) return;

    await messagesModel.updateMany(
        { receiverId: userId, status: "sent" },
        {
            $set: {
                status: "delivered",
                deliveredAt: now,
            },
        },
    );

    pendingMessages.forEach((pendingMessage) => {
        const senderSocketIds = getReceiverSocketIds(pendingMessage.senderId);
        senderSocketIds.forEach((senderSocketId) => {
            io.to(senderSocketId).emit("message_delivered", {
                _id: pendingMessage._id,
                status: "delivered",
                deliveredAt: now,
                receiverId: pendingMessage.receiverId,
                conversationId: pendingMessage.conversationId,
            });
        });
    });
};

const resolveConversation = async (currentUserId, conversationId) => {
    if (!conversationId) return null;

    let conversation = null;

    if (mongoose.Types.ObjectId.isValid(conversationId)) {
        conversation = await conversationModel.findOne({
            _id: conversationId,
            participants: currentUserId,
        });
    }

    if (conversation) return conversation;

    const participants = [
        new mongoose.Types.ObjectId(currentUserId),
        new mongoose.Types.ObjectId(conversationId),
    ].sort();

    return conversationModel.findOne({ participants });
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId && userId !== "undefined") {
        const userKey = String(userId);
        const existingSockets = userSocketMap.get(userKey) || new Set();
        const wasOffline = existingSockets.size === 0;

        existingSockets.add(socket.id);
        userSocketMap.set(userKey, existingSockets);
        socketUserMap.set(socket.id, userKey);

        if (wasOffline) {
            socket.broadcast.emit("user_online", {
                userId: userKey,
            });
        }

        void markPendingMessagesAsDelivered(userKey);
    }

    // Broadcast to everyone the currently active users
    socket.emit("getOnlineUsers", getConnectedUserIds());

    socket.on("typing", ({ receiverId }) => {
        if (!userId || !receiverId) return;

        rememberTypingTarget(userId, receiverId);

        const receiverSocketIds = getReceiverSocketIds(receiverId);
        receiverSocketIds.forEach((receiverSocketId) => {
            io.to(receiverSocketId).emit("typing", {
                userId: String(userId),
                receiverId: String(receiverId),
            });
        });
    });

    socket.on("send_message", ({ receiverId, tempId }) => {
        if (!userId || !receiverId) return;

        const senderSocketIds = getReceiverSocketIds(userId);
        senderSocketIds.forEach((senderSocketId) => {
            io.to(senderSocketId).emit("send_message", {
                senderId: String(userId),
                receiverId: String(receiverId),
                tempId: tempId || null,
            });
        });
    });

    socket.on("mark_as_seen", async ({ conversationId }) => {
        if (!userId || !conversationId) return;

        try {
            const conversation = await resolveConversation(userId, conversationId);
            if (!conversation) return;

            const pendingMessages = await messagesModel.find({
                conversationId: conversation._id,
                receiverId: userId,
                status: { $ne: "seen" },
            });

            if (pendingMessages.length === 0) return;

            const seenAt = new Date();

            await messagesModel.updateMany(
                {
                    conversationId: conversation._id,
                    receiverId: userId,
                    status: { $ne: "seen" },
                },
                {
                    $set: {
                        read: true,
                        status: "seen",
                        seenAt,
                    },
                },
            );

            pendingMessages.forEach((pendingMessage) => {
                const senderSocketIds = getReceiverSocketIds(pendingMessage.senderId);
                senderSocketIds.forEach((senderSocketId) => {
                    io.to(senderSocketId).emit("message_seen", {
                        _id: pendingMessage._id,
                        status: "seen",
                        seenAt,
                        conversationId: pendingMessage.conversationId,
                        receiverId: pendingMessage.receiverId,
                    });
                });
            });
        } catch (error) {
            console.error("Failed to mark messages as seen:", error);
        }
    });

    socket.on("stop_typing", ({ receiverId }) => {
        if (!userId || !receiverId) return;

        clearTypingState(userId, receiverId);

        const receiverSocketIds = getReceiverSocketIds(receiverId);
        receiverSocketIds.forEach((receiverSocketId) => {
            io.to(receiverSocketId).emit("stop_typing", {
                userId: String(userId),
                receiverId: String(receiverId),
            });
        });
    });

    socket.on("disconnect", () => {
        const userKey = socketUserMap.get(socket.id) || (userId && userId !== "undefined" ? String(userId) : null);

        if (userKey) {
            socketUserMap.delete(socket.id);

            const userSockets = userSocketMap.get(userKey);
            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    userSocketMap.delete(userKey);
                } else {
                    userSocketMap.set(userKey, userSockets);
                }
            }

            const stillOnline = (userSocketMap.get(userKey)?.size || 0) > 0;
            if (stillOnline) {
                io.emit("getOnlineUsers", getConnectedUserIds());
                return;
            }

            const typingTargets = typingTargetsMap.get(userKey);

            if (typingTargets?.size) {
                typingTargets.forEach((receiverId) => {
                    const receiverSocketIds = getReceiverSocketIds(receiverId);
                    receiverSocketIds.forEach((receiverSocketId) => {
                        io.to(receiverSocketId).emit("stop_typing", {
                            userId: userKey,
                            receiverId,
                        });
                    });
                });
            }

            typingTargetsMap.delete(userKey);

            void markUserOffline(userKey);

            io.emit("user_offline", {
                userId: userKey,
                lastSeenAt: new Date().toISOString(),
            });
        }
        io.emit("getOnlineUsers", getConnectedUserIds());
    });
});

export { app, io, server };

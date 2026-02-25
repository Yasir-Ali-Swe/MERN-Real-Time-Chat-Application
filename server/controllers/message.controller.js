import mongoose from "mongoose";
import messagesModel from "../models/message.model.js";
import conversationModel from "../models/conversation.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text } = req.body;

    if (!receiverId || !senderId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and sender ID are required",
      });
    }

    if (!text && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Message text or image is required",
      });
    }

    let imageUrl = "";

    if (req.file) {
      try {
        const streamUpload = (req) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "chat_images",
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
        };

        const result = await streamUpload(req);
        imageUrl = result.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
          error: error.message,
        });
      }
    }

    const participants = [
      new mongoose.Types.ObjectId(senderId),
      new mongoose.Types.ObjectId(receiverId),
    ].sort();

    let conversation = await conversationModel.findOne({ participants });
    if (!conversation) {
      conversation = new conversationModel({ participants });
    }

    const message = new messagesModel({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    await message.save();

    conversation.lastMessage = message._id;
    await conversation.save();

    // Socket.io function to emit to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", message);
    }

    return res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create message",
      error: error.message,
    });
  }
};

export const getConversation = async (req, res) => {
  try {
    const receiverId = req.params.conversationId; // it's actually receiverId from the route
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    const participants = [
      new mongoose.Types.ObjectId(senderId),
      new mongoose.Types.ObjectId(receiverId),
    ].sort();

    const conversation = await conversationModel.findOne({ participants });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    const messages = await messagesModel
      .find({ conversationId: conversation._id })
      .select("-__v -updatedAt")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await conversationModel
      .find({ participants: userId })
      .populate({
        path: "participants",
        select: "fullName email profilePicture",
        match: { _id: { $ne: userId } },
      })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const formattedConversations = await Promise.all(
      conversations.map(async (conv) => {
        // Calculate unread count specifically where the currentUser is the receiver and `read: false`
        const unreadCount = await messagesModel.countDocuments({
          conversationId: conv._id,
          read: false,
          receiverId: userId,
        });

        // Filter out the null participant (which was the current user matched out)
        const participants = conv.participants.filter(p => p != null);

        return {
          _id: conv._id,
          participants,
          lastMessage: conv.lastMessage,
          unreadCount,
          updatedAt: conv.updatedAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      conversations: formattedConversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const receiverId = req.params.conversationId; // actually receiverId from frontend route
    const userId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    const participants = [
      new mongoose.Types.ObjectId(userId),
      new mongoose.Types.ObjectId(receiverId),
    ].sort();

    const conversation = await conversationModel.findOne({ participants });

    if (!conversation) {
      return res.status(200).json({ success: true, message: "No conversation" });
    }

    await messagesModel.updateMany(
      { conversationId: conversation._id, receiverId: userId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
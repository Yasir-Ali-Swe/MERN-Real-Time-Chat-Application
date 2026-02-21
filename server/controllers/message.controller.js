import mongoose from "mongoose";
import messagesModel from "../models/message.model.js";
import conversationModel from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text, image } = req.body;

    if (!receiverId || !senderId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and sender ID are required",
      });
    }
    const participants = [
      new mongoose.Types.ObjectId(senderId),
      new mongoose.Types.ObjectId(receiverId),
    ].sort();
    let conversation = await conversationModel.findOne({ participants });
    if (!conversation) {
      conversation = new conversationModel({ participants });
      await conversation.save();
    }
    const message = new messagesModel({
      conversationId: conversation._id,
      senderId,
      text,
      image,
    });
console.log("Created message object:", message);
    await message.save();
    return res.status(201).json({
      success: true,
      message: "Message created successfully",
    });
  } catch (error) {
    console.error("SendMessage Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create message",
      error: error.message,
    });
  }
};
import express from "express";
import {
  sendMessage,
  getConversation,
  getUserConversations,
  markAsRead,
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/send-message", authMiddleware, upload.single("image"), sendMessage);
router.get(
  "/get-conversation/:conversationId",
  authMiddleware,
  getConversation,
);
router.get("/get-user-conversations", authMiddleware, getUserConversations);
router.patch("/mark-as-read/:conversationId", authMiddleware, markAsRead);

export default router;

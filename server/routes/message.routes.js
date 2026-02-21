import express from "express";
import {
  sendMessage,
  getConversation,
} from "../controllers/message.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send-message", authMiddleware, sendMessage);
router.get(
  "/get-conversation/:conversationId",
  authMiddleware,
  getConversation,
);
export default router;

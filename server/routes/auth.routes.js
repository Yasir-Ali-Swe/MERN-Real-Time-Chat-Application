import express from "express";
import {
  register,
  verifyEmail,
  login,
  logout,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.post("/logout", logout); 

export default router;

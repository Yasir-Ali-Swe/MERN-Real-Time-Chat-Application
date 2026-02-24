import express from "express";
import { getUsers, updateProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getUsers);
router.patch("/me", authMiddleware, upload.single("avatar"), updateProfile);

export default router;

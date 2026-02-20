import userModel from "../models/user.model.js";
import { sendVerificationEmail } from "../utils/verify.email.js";
import { generateToken } from "../utils/jwt.helper.js";
import { hashPassword } from "../utils/password.helper.js";
import { getUserFromToken } from "../utils/jwt.helper.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already registered" });
    }
    if (existingUser && !existingUser.isVerified) {
      const token = generateToken(existingUser._id, "15m");
      await sendVerificationEmail({
        name: existingUser.fullName,
        email,
        token,
        expireIn: "15 minutes",
      });
      return res
        .status(200)
        .json({ success: true, message: "Verification email resend sent" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new userModel({
      fullName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = generateToken(newUser._id, "15m");
    await sendVerificationEmail({ name: fullName, email, token });
    res.status(201).json({
      success: true,
      message: "User registered. Please verify your email.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Verification token is required" });
    }
    const user = await getUserFromToken(token);
    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email is already verified" });
    }
    user.isVerified = true;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

import userModel from "../models/user.model.js";
import { sendVerificationEmail } from "../utils/verify.email.js";
import { generateToken } from "../utils/jwt.helper.js";
import { hashPassword, comparePassword } from "../utils/password.helper.js";
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

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const accessToken = generateToken(user._id, "1h", user.tokenVersion);
    const refreshToken = generateToken(user._id, "7d", user.tokenVersion);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const refreshAuthToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "No refresh token provided" });
    }
    const { id, tokenVersion } = await getUserFromToken(refreshToken);
    const user = await userModel.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.tokenVersion !== tokenVersion) {
      return res
        .status(401)
        .json({ success: false, message: "Token has been revoked" });
    }
    const newAccessToken = generateToken(user._id, "1h", user.tokenVersion);
    const newRefreshToken = generateToken(user._id, "7d", user.tokenVersion);
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token provided" });
    }
    const { id } = await getUserFromToken(token);
    const user = await userModel
      .findById(id)
      .select("-password -__v -tokenVersion -createdAt -updatedAt");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "No active session found" });
    }
    const user = await getUserFromToken(refreshToken);
    user.tokenVersion += 1; // Invalidate all existing tokens
    await user.save();
    res.clearCookie("refreshToken");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

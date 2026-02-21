import { getUserFromToken } from "../utils/jwt.helper.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized: No token provided",
      });
    }
    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized: Invalid token",
      });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Not Authorized: User not verified",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
      error
    }); 
  }
};

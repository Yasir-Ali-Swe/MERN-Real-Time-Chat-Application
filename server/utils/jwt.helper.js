import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

export const generateToken = (id, expiresIn, tokenVersion = 0) => {
  return jwt.sign({ id, tokenVersion }, JWT_SECRET, {
    expiresIn,
  });
};

export const getUserFromToken = async (token) => {
  try {
    if (!token) {
      const err = new Error("Not authorized, no token provided");
      err.status = 401;
      throw err;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    if (user.tokenVersion !== decoded.tokenVersion) {
      const err = new Error("Token has been revoked");
      err.status = 401;
      throw err;
    }
    return user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      const err = new Error("Invalid or expired token");
      err.status = 401;
      throw err;
    }
    const err = new Error("Failed to authenticate token");
    err.status = 500;
    throw err;
  }
};

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const generateToken = (
  id,
  purpose = "auth",
  expiresIn,
  tokenVersion = 0,
) => {
  return jwt.sign({ id, purpose, tokenVersion }, JWT_SECRET, {
    expiresIn,
  });
};

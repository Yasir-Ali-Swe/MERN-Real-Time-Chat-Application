import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.connect.js";
import { PORT } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, async () => {
  console.log("Server is running on port 5000");
  await connectDB();
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.connect.js";
import { PORT } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.listen(PORT, async () => {
  console.log("Server is running on port 5000");
  await connectDB();
});

app.use("/api/auth", authRoutes);

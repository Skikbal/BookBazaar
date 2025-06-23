import express from "express";
import healthChckRouter from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// rotes
app.use("/api/v1", healthChckRouter);
app.use("/api/v1/auth", authRouter);

export default app;

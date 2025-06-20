import express from "express";
import healthChckRouter from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js";
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rotes
app.use("/api/v1", healthChckRouter);
app.use("/api/v1/auth", authRouter);

export default app;

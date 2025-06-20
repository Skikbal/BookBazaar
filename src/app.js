import express from "express";
import healthChckRouter from "./routes/healthCheck.routes.js";
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rotes
app.use("/api/v1", healthChckRouter);
export default app;

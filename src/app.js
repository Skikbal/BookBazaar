import express from "express";
import healthChckRouter from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import bookRouter from "./routes/books.routes.js";

import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.middleware.js";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// rotes
app.use("/api/v1", healthChckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/books", bookRouter);

// GLOBAL ERROR HANDLER
app.use(errorHandler);

export default app;

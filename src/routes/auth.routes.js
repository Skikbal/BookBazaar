import { Router } from "express";
import { loginHandler, registrationHandler, verifyUserHandler } from "../controllers/auth.controller.js";
import validate from "../middleware/validation.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";

const authRouter = Router();

// public routes
authRouter.route("/signup").post(validate(registerSchema), registrationHandler);
authRouter.route("/login").post(loginHandler);
authRouter.get("/verify/:token", verifyUserHandler);

// private routes

export default authRouter;

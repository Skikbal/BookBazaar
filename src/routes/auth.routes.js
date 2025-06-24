import { Router } from "express";
import { getProfileHandler, loginHandler, logoutHandler, registrationHandler, verifyUserHandler } from "../controllers/auth.controller.js";
import validate from "../middleware/validation.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";
import isAuthenticated from "../middleware/isAuthenticated.middleware.js";

const authRouter = Router();

// public routes
authRouter.route("/register").post(validate(registerSchema), registrationHandler);
authRouter.route("/login").post(loginHandler);
authRouter.route("/verify/:token").get(verifyUserHandler);

// private routes
authRouter.route("/me").get(isAuthenticated, getProfileHandler);
authRouter.route("/logout").post(isAuthenticated, logoutHandler);
export default authRouter;

import { Router } from "express";
import { registrationHandler } from "../controllers/auth.controller.js";
import validate from "../middleware/validation.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.route("/signup").post(validate(registerSchema), registrationHandler);

export default authRouter;

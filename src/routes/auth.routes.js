import { Router } from "express";
import { registrationHandler } from "../controllers/auth.controller.js";
const authRouter = Router();

authRouter.route("/signup").post(registrationHandler);

export default authRouter;

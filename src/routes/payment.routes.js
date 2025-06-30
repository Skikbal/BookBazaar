import { paymentHandler, verifyPaymentHandler } from "../controllers/payment.controller.js";

import Router from "express";
import isAuthenticated from "../middleware/isAuthenticated.middleware.js";

const paymentRouter = Router();
paymentRouter.route("/").get(isAuthenticated, paymentHandler);

paymentRouter.route("/verify").post(isAuthenticated, verifyPaymentHandler);

export default paymentRouter;

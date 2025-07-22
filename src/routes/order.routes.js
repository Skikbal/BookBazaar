import Router from "express";
import isAuthenticated from "../middleware/isAuthenticated.middleware.js";
import { createOrderHandler, getUserOrdersHandler, getOrderByIdHandler } from "../controllers/orders.controller.js";
import verifyApiKey from "../middleware/verifyApikey.middleware.js";
const orderRouter = Router();

orderRouter.route("/create").post(isAuthenticated, verifyApiKey, createOrderHandler);
orderRouter.route("/").get(isAuthenticated, verifyApiKey, getUserOrdersHandler);
orderRouter.route("/:id").get(isAuthenticated, verifyApiKey, getOrderByIdHandler);

export default orderRouter;

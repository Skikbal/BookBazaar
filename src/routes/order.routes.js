import Router from "express";
import isAuthenticated from "../middleware/isAuthenticated.middleware.js";
import { createOrderHandler, getUserOrdersHandler, getOrderByIdHandler } from "../controllers/orders.controller.js";
const orderRouter = Router();

orderRouter.route("/create").post(isAuthenticated, createOrderHandler);
orderRouter.route("/").get(isAuthenticated, getUserOrdersHandler);
orderRouter.route("/:id").get(isAuthenticated, getOrderByIdHandler);

export default orderRouter;

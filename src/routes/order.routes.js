import Router from "express";
import isAuthenticated, { isAuthenticated as isAuthWithOptions } from "../middleware/isAuthenticated.middleware.js";
import { createOrderHandler, getUserOrdersHandler, getOrderByIdHandler } from "../controllers/orders.controller.js";
const orderRouter = Router();

orderRouter.route("/create").post(isAuthenticated, createOrderHandler);
orderRouter.route("/").get(isAuthWithOptions(true), getUserOrdersHandler);
orderRouter.route("/:id").get(isAuthenticated, getOrderByIdHandler);

export default orderRouter;

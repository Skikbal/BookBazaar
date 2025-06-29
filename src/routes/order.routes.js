import Router from "express";
import isAuthenticated from "../middleware/isAuthenticated.middleware.js";
import { createOrderHandler } from "../controllers/orders.controller.js";
const orderRouter = Router();

orderRouter.route("/create").post(isAuthenticated, createOrderHandler);

export default orderRouter;

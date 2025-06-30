import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.middleware.js";
import { addItemsToCartHandler, getUserCartHandler, removeItemFromCartHandler, updateCartHandler } from "../controllers/cart.controller.js";

const cartRouter = Router();
cartRouter.route("/add").post(isAuthenticated, addItemsToCartHandler);
cartRouter.route("/remove/:bookId").delete(isAuthenticated, removeItemFromCartHandler);
cartRouter.route("/update").put(isAuthenticated, updateCartHandler);
cartRouter.route("/").get(isAuthenticated, getUserCartHandler);

export default cartRouter;

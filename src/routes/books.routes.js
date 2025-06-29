import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import { createBookHandler, deleteBookHandler, getAllBooksHandler, getBookByIdHandler, updateBoookHandler } from "../controllers/books.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import bookValidator from "../validators/book.validator.js";
import validate from "../middleware/validation.middleware.js";
import parseForm from "../middleware/parseForm.middleware.js";
import { addReviewHandler, deleteReviewHandler, listReviewsHandler } from "../controllers/reviews.controller.js";
import reviewValidator from "../validators/reviews.validator.js";
const bookRouter = Router();

// user routes
bookRouter.route("/").get(isAuthenticated, getAllBooksHandler);
bookRouter.route("/books/:id").get(isAuthenticated, getBookByIdHandler);

// admin routes
bookRouter.route("/create").post(isAuthenticated, isAdmin, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 6 },
]), parseForm(["genre", "price", "stock"]), validate(bookValidator), createBookHandler);
bookRouter.route("/delete/:id").delete(isAuthenticated, isAdmin, deleteBookHandler);
bookRouter.route("/update/:id").put(isAuthenticated, isAdmin, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 6 },
]), parseForm(["genre", "price", "stock"]), validate(bookValidator), updateBoookHandler);

// reviews
bookRouter.route("/:id/add").post(isAuthenticated, upload.fields([{ name: "images", maxCount: 6 }]), parseForm(["rating"]), validate(reviewValidator), addReviewHandler);
bookRouter.route("/:id/reviews").get(isAuthenticated, listReviewsHandler);
bookRouter.route("/:id/reviews/:id").delete(isAuthenticated, deleteReviewHandler);

export default bookRouter;

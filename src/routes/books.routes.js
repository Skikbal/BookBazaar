import { Router } from "express";
import isAuthenticated from "../middleware/isAuthenticated.middleware.js";
import isAdmin from "../middleware/isAdmin.middleware.js";
import { createBookHandler } from "../controllers/books.controller.js";
import { upload } from "../middleware/multer.middleware.js";
// import bookValidator from "../validators/book.validator.js";
// import validate from "../middleware/validation.middleware.js";
const bookRouter = Router();

bookRouter.route("/create").post(isAuthenticated, isAdmin, upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 6 },
]), createBookHandler);

export default bookRouter;

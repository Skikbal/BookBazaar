import ApiError from "../utils/ApiError.js";
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ApiError(403, "Access denied. Only admin users are allowed."));
  }
  next();
};

export default isAdmin;

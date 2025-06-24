import { ACCESS_TOKEN_SECRET } from "../config/envConfig.js";
import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return next(new ApiError(401, "User is not authenticated"));
  }
  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    if (!decoded.isVerified) {
      return next(new ApiError(401, "User is not verified please verify your email"));
    }
    req.user = decoded;
    next();
  }
  catch (error) {
    next(new ApiError(401, "Invalid or Expired Access Token", error));
  }
};

export default isAuthenticated;

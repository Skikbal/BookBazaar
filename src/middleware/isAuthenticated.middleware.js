import { ACCESS_TOKEN_SECRET } from "../config/envConfig.js";
import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { ApiKey } from "../models/api-key.model.js";
import crypto from "crypto";
const isAuthenticated = async (req, res, next) => {
  const { accessToken } = req.cookies;
  if (accessToken) {
    // return next(new ApiError(401, "User is not authenticated"));
    try {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      if (!decoded.isVerified) {
        return next(new ApiError(401, "User is not verified please verify your email"));
      }
      req.user = decoded;
      return next();
    }
    catch (error) {
      next(new ApiError(401, "Invalid or Expired Access Token", error));
    }
  }
  // SECOND ATTEMPT FOR CHECK APIKEYS IN HEADER
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) {
    throw new ApiError(401, "Unauthorized Access");
  }
  const hasedApiKey = crypto.createHash("sha256").update(apiKey).digest("hex");
  try {
    const apikey = await ApiKey.findOne({
      apikey: hasedApiKey,
      apiKeyExpiry: { $gt: Date.now() },
    }).populate("generatedBy");
    if (!apikey) {
      return next(new ApiError(401, "Invalid or expired API key"));
    }
    apikey.lastUsedAt = new Date(Date.now());
    await apikey.save();
    req.user = {
      _id: apikey.generatedBy._id,
      email: apikey.generatedBy.email,
      role: apikey.generatedBy.role,
      isVerified: apikey.generatedBy.isVerified,
    };
    return next();
  }
  catch (error) {
    return next(new ApiError(401, "Invalid or expired API key", error));
  }
};

export default isAuthenticated;

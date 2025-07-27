import { ACCESS_TOKEN_SECRET } from "../config/envConfig.js";
import ApiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { ApiKey } from "../models/api-key.model.js";
import crypto from "crypto";

const isAuthenticated = (allowApiKey = false) => {
  return async (req, res, next) => {
    const { accessToken } = req.cookies;

    // 1. Try JWT-based authentication
    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        if (!decoded.isVerified) {
          return next(new ApiError(401, "User is not verified. Please verify your email."));
        }

        req.user = decoded;
        req.authMethod = "jwt";
        return next();
      }
      catch (error) {
        // Token invalid or expired
        if (!allowApiKey) {
          return next(new ApiError(401, "Invalid or expired access token", error));
        }
        // Fall through to API key check if allowed
      }
    }
    else if (!allowApiKey) {
      return next(new ApiError(401, "User is not authenticated"));
    }

    // 2. Try API Key-based authentication
    const rawApiKey = req.headers["x-api-key"];
    if (!rawApiKey) {
      return next(new ApiError(401, "API key is missing"));
    }

    const hashedApiKey = crypto.createHash("sha256").update(rawApiKey).digest("hex");

    try {
      const apikey = await ApiKey.findOne({
        apikey: hashedApiKey,
        apiKeyExpiry: { $gt: Date.now() },
      }).populate("generatedBy");

      if (!apikey) {
        return next(new ApiError(401, "Invalid or expired API key"));
      }

      // Update last used timestamp
      apikey.lastUsedAt = new Date();
      await apikey.save();

      req.user = {
        _id: apikey.generatedBy._id,
        email: apikey.generatedBy.email,
        role: apikey.generatedBy.role,
        isVerified: apikey.generatedBy.isVerified,
      };
      req.authMethod = "apiKey";

      return next();
    }
    catch (error) {
      return next(new ApiError(401, "Failed to authenticate API key", error));
    }
  };
};

export default isAuthenticated();
export { isAuthenticated };

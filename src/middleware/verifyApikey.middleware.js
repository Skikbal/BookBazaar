import { ApiKey } from "../models/api-key.model.js";
import ApiError from "../utils/apiError.js";
import crypto from "crypto";
const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      throw new ApiError(401, "Unauthorized Access");
    }

    const hasedApiKey = crypto.createHash("sha256").update(apiKey).digest("hex");
    const apikey = await ApiKey.findOne({
      apikey: hasedApiKey,
      apiKeyExpiry: { $gt: Date.now() },
    });
    apikey.lastUsedAt = new Date(Date.now());
    await apikey.save();

    if (!apiKey) {
      throw new ApiError(401, "Invalid or expired API key");
    }
    next();
  }
  catch (error) {
    next(error);
  }
};

export default verifyApiKey;

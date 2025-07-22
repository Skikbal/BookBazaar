import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import crypto from "crypto";
const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      throw new ApiError(401, "Unauthorized Access");
    }

    const hasedApiKey = crypto.createHash("sha256").update(apiKey).digest("hex");

    const user = await User.findOne({
      apikey: hasedApiKey,
      apikeyExpiry: { $gt: Date.now() },
    });
    if (!user) {
      throw new ApiError(401, "Invalid or expired API key");
    }
    next();
  }
  catch (error) {
    next(error);
  }
};

export default verifyApiKey;

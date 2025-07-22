import { ApiKey } from "../models/api-key.model.js";
import crypto from "crypto";
import ApiError from "./apiError.js";

export async function generateApikey(userId, expiryInDays = 30) {
  try {
    const rawApikey = crypto.randomBytes(32).toString("hex");
    const hashedApikey = crypto.createHash("sha256").update(rawApikey).digest("hex");
    const apikeyExpiry = new Date(Date.now() + expiryInDays * 24 * 60 * 60 * 1000);

    await ApiKey.create({
      apikey: hashedApikey,
      apiKeyExpiry: apikeyExpiry,
      generatedBy: userId,
    });

    return rawApikey;
  }
  catch (error) {
    throw new ApiError(500, "Failed to generate API key", error);
  }
}

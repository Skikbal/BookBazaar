import { ApiKey } from "../models/api-key.model.js";
import { generateApikey } from "../utils/generateApikey.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import AsyncHandler from "../utils/asyncHandler.js";

// genrate a new Apikey
const handleGenrateApikeyHandler = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const numberOfKeys = await ApiKey.countDocuments({ generatedBy: userId });
  if (numberOfKeys >= 3) {
    throw new ApiError(400, "You have reached the maximum number of API keys allowed");
  }
  const apikey = await generateApikey(userId);
  if (!apikey) {
    throw new ApiError(500, "Failed to generate API key");
  }
  return res.status(200).json(new ApiResponse(200, "API key generated successfully", apikey));
});

// delete a Apikey
const handleApikeysDeleteHandler = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const apikey = await ApiKey.findOneAndDelete({ _id: id, generatedBy: userId });
  if (!apikey) {
    throw new ApiError(404, "API key not found");
  }
  return res.status(200).json(new ApiResponse(200, "API key deleted successfully"));
});

// get All Apikeys
const handleGetApikeysHandler = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const apikeys = await ApiKey.find({ generatedBy: userId });
  if (!apikeys) {
    throw new ApiError(404, "API keys not found");
  }
  return res.status(200).json(new ApiResponse(200, "API keys fetched successfully", apikeys));
});
export { handleGenrateApikeyHandler, handleApikeysDeleteHandler, handleGetApikeysHandler };

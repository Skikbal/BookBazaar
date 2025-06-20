import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

const handleHealthchekHandler = AsyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, { message: "server is up and running" }));
});

export { handleHealthchekHandler };

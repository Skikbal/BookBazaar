import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";

// register user handler
const registrationHandler = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const newUser = await User.create({ email, password });
  if (!newUser) {
    throw new ApiError(400, "User creation failed");
  }

  const { hashedToken, tokenExpiry } = newUser.generateRandomToken(10);

  newUser.verificationToken = hashedToken;
  newUser.verificationTokenExpiry = tokenExpiry;
  await newUser.save();
  const user = await User.findById(newUser._id).select("-password", "-verificationToken", "-verificationTokenExpiry");
  // send email
  return res.status(201).json(new ApiResponse(201, "User created successfully", user));
});
export { registrationHandler };

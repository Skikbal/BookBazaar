import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { sendEmail, emailVerificationMailgenContent } from "../services/mail.service.js";
// register user handler
const registrationHandler = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  const userName = email.split("@")[0];
  const newUser = await User.create({ email, password, userName });
  if (!newUser) {
    throw new ApiError(400, "User creation failed");
  }

  const { unhashedToken, hashedToken, tokenExpiry } = newUser.generateRandomToken(10);

  newUser.verificationToken = hashedToken;
  newUser.verificationTokenExpiry = tokenExpiry;
  await newUser.save();
  const user = await User.findById(newUser._id).select({ password: 0, verificationToken: 0, verificationTokenExpiry: 0 });
  // send email
  await sendEmail({
    email,
    subject: "Verify your email address",
    mailgenContent: emailVerificationMailgenContent(user.userName, unhashedToken),
  });

  return res.status(201).json(new ApiResponse(201, "User created successfully", user));
});

// login handler
const loginHandler = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (!user.isVerified) {
    throw new ApiError(400, "User is not verified");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid username or password");
  }
  const { accessToken, refreshToken } = await user.generateToken();
  user.refreshToken = refreshToken;
  await user.save();
  const userData = await User.findById(user._id).select({ password: 0, refreshToken: 0, verificationToken: 0, verificationTokenExpiry: 0 });
  const cookiesOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .json(new ApiResponse(200, "Login successful", userData));
});

export { registrationHandler, loginHandler };

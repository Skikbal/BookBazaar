import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { sendEmail, emailVerificationMailgenContent } from "../services/mail.service.js";
import { VERIFICATION_URL, REFRESH_TOKEN_SECRET } from "../config/envConfig.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
// register user handler
const registrationHandler = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
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
  const verificationUrl = `${VERIFICATION_URL}/${unhashedToken}`;
  // send email
  await sendEmail({
    email,
    subject: "Verify your email address",
    mailgenContent: emailVerificationMailgenContent(user.userName, verificationUrl),
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

// verify user handler
const verifyUserHandler = AsyncHandler(async (req, res) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    $and: [
      { verificationToken: hashedToken },
      { verificationTokenExpiry: { $gt: Date.now() } },
    ],
  });

  if (!user) {
    throw new ApiError(404, "Invalid or expired token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();
  return res.status(200).json(new ApiResponse(200, "User verified successfully"));
});

// resend verification email
const resendVerificationEmailHandler = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  const { unhashedToken, hashedToken, tokenExpiry } = user.generateRandomToken(10);

  user.verificationToken = hashedToken;
  user.verificationTokenExpiry = tokenExpiry;
  await user.save();
  const verificationUrl = `${VERIFICATION_URL}/${unhashedToken}`;
  // send email
  await sendEmail({
    email,
    subject: "Verify your email address",
    mailgenContent: emailVerificationMailgenContent(user.userName, verificationUrl),
  });
  return res.status(200).json(new ApiResponse(200, "Verification email sent successfully"));
});

// get profile handler
const getProfileHandler = AsyncHandler(async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id).select({ password: 0, refreshToken: 0, verificationToken: 0, verificationTokenExpiry: 0 });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return res.status(200).json(new ApiResponse(200, "Profile fetched successfully", user));
});
// logout handler
const logoutHandler = AsyncHandler(async (req, res) => {
  const _id = req.user._id;
  const user = await User.findById(_id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.refreshToken = undefined;
  await user.save();
  const cookiesOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 0,
  };
  return res
    .status(200)
    .cookie("accessToken", "", cookiesOptions)
    .cookie("refreshToken", "", cookiesOptions)
    .json(new ApiResponse(200, "Logout successful"));
});

// regenrate access token & refresh token handler
const regenrateTokenHandler = AsyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw new ApiError(401, "User is not authenticated");
  }
  let decode;
  try {
    decode = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  }
  catch (error) {
    throw new ApiError(401, "Invalid or Expired Refresh Token", error);
  }
  const user = await User.findById(decode._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Refresh token does not match. Possible token reuse detected.");
  }
  const { accessToken, refreshToken: newRefreshToken } = user.generateToken();

  const cookiesOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  user.refreshToken = newRefreshToken;
  await user.save();

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookiesOptions)
    .cookie("refreshToken", newRefreshToken, cookiesOptions)
    .json(new ApiResponse(200, "Token regenrated successfully"));
});

export { registrationHandler, loginHandler, verifyUserHandler, getProfileHandler, logoutHandler, resendVerificationEmailHandler, regenrateTokenHandler };

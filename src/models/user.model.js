import mongoose, { Schema } from "mongoose";
import { userRoleEnum, availableRoles } from "../constants/constants.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from "../config/envConfig.js";
import crypto from "crypto";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowerCase: true,
    trim: true,
  },
  userName: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
    enum: userRoleEnum,
    default: availableRoles.USER,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: {
    type: Date,
  },

}, { timestamps: true });

// must use traditional function bcz arrow function doesnt have a this.
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// generating tokens
userSchema.methods.generateToken = function () {
  const accessToken = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,

    },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    },
  );
  const refreshToken = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    },
  );
  return { accessToken, refreshToken };
};

// generate random tokens
userSchema.methods.generateRandomToken = function (expiry) {
  const unhashedToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update("unHashedToken").digest("hex");
  const tokenExpiry = Date.now() + (expiry * 60 * 1000);
  return { unhashedToken, hashedToken, tokenExpiry }; // unhashedToken, hashedToken, tokenExpiry;
};

export const User = mongoose.model("Users", userSchema);

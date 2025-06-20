import mongoose, { Schema } from "mongoose";
import { ratingEnum, availableRatings } from "../constants/constants.js";
const reviewSchema = new Schema({
  review: {
    type: String,
  },
  rating: {
    type: Number,
    enum: ratingEnum,
    default: availableRatings.ONE,
  },
  bookId: {
    type: Schema.Types.ObjectId,
    ref: "Books",
    required: true,
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
}, { timestamps: true });

export const Review = mongoose.model("Reviews", reviewSchema);

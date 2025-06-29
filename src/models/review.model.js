import mongoose, { Schema } from "mongoose";
import { ratingEnum, availableRatings } from "../constants/constants.js";
const reviewSchema = new Schema({
  review: {
    type: String,
  },
  images: [
    {
      url: {
        type: String,
        trim: true,
      },
      mimeType: {
        type: String,
        default: undefined,
      },
      size: {
        type: Number,
        default: undefined,
      },
    },
  ],
  rating: {
    type: Number,
    enum: availableRatings,
    default: ratingEnum.ONE,
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

reviewSchema.index({ book: 1, reviewedBy: 1 }, { unique: true });

export const Review = mongoose.model("Reviews", reviewSchema);

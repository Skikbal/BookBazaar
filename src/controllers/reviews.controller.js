import { Review } from "../models/review.model.js";
import AsyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import uploadToCloudinary from "../services/cloudinary.service.js";
import mongoose from "mongoose";
// add review handler
const addReviewHandler = AsyncHandler(async (req, res) => {
  const { review, rating } = req.body;
  const bookId = req.params.id;

  const existingReview = await Review.findOne({ bookId, reviewedBy: req.user._id });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this book");
  }

  const images = req?.files?.images;
  let reviewImages = [];
  if (images) {
    reviewImages = await Promise.all(images.map(async (image) => {
      const imageUrl = await uploadToCloudinary(image);
      return ({
        url: imageUrl?.url ?? "",
        mimeType: imageUrl?.mimetype ?? "",
        size: imageUrl?.size ?? 0,
      });
    }));
  }
  const newReview = await Review.create({
    review,
    rating,
    bookId,
    images: reviewImages,
    reviewedBy: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, "Review added successfully", newReview));
});

// list of reviews for a book handler
const listReviewsHandler = AsyncHandler(async (req, res) => {
  const bookId = req.params.id;

  const reviews = await Review.aggregate([
    {
      $match: { bookId: new mongoose.Types.ObjectId(bookId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "reviewedBy",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $project: {
        review: 1,
        rating: 1,
        reviewedBy: {
          _id: "$userInfo._id",
          email: "$userInfo.email",
          userName: "$userInfo.userName",
          role: "$userInfo.role",
          isVerified: "$userInfo.isVerified",
        },
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, "Reviews fetched successfully", reviews));
});

// Delete review handler
const deleteReviewHandler = AsyncHandler(async (req, res) => {
  const reviewId = req.params.id;

  const review = await Review.findOneAndDelete({ _id: reviewId, reviewedBy: req.user._id });
  if (!review) {
    throw new ApiError(404, "Review not found");
  }
  return res.status(200).json(new ApiResponse(200, "Review deleted successfully"));
});

export {
  addReviewHandler,
  listReviewsHandler,
  deleteReviewHandler,
};

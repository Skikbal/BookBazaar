import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
  },
  author: {
    type: String,
    required: true,
  },
  genre: [
    {
      type: String,
      required: true,
    },
  ],
  language: {
    type: String,
    default: "English",
  },
  publisher: {
    type: String,
  },
  publicationDate: {
    type: Date,
  },
  coverImage: {
    url: {
      type: String,
      trim: true,
      required: true,
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
  price: {
    type: String,
    required: true,
  },
  stock: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
}, { timestamps: true });

export const Book = mongoose.model("Books", bookSchema);

import AsyncHandler from "../utils/asyncHandler.js";
import { Book } from "../models/book.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import uploadToCloudinary from "../services/cloudinary.service.js";

// create books handler
const createBookHandler = AsyncHandler(async (req, res) => {
  const {
    title,
    description,
    author,
    genre,
    language,
    publisher,
    publicationDate,
    price,
    stock,
  } = req.body;

  const userId = req.user._id;

  const coverImage = req?.files?.coverImage[0];
  const coverImageUrl = await uploadToCloudinary(coverImage);

  const newBook = await Book.create({
    title,
    description,
    author,
    genre,
    language,
    stock,
    publisher,
    publicationDate,
    price,
    createdBy: userId,
    coverImage: {
      url: coverImageUrl?.url ?? "",
      mimeType: coverImageUrl?.mimetype ?? "",
      size: coverImageUrl?.size ?? 0,
    },
  });

  if (!newBook) {
    throw new ApiError(500, "Failed to create book");
  }

  const images = req?.files?.images;
  if (images) {
    const uploadImages = await Promise.all(images.map(async (image) => {
      const imageUrl = await uploadToCloudinary(image);
      return ({
        url: imageUrl?.url ?? "",
        mimeType: imageUrl?.mimetype ?? "",
        size: imageUrl?.size ?? 0,
      });
    }));
    newBook.images.push(...uploadImages);
    await newBook.save();
  }

  return res.status(201).json(new ApiResponse(201, "Book created successfully", newBook));
});

// get all books handler
const getAllBooksHandler = AsyncHandler(async (req, res) => {
  const books = await Book.find();
  if (!books) {
    throw new ApiError(500, "Failed to fetch books");
  }
  return res.status(200).json(new ApiResponse(200, "Books fetched successfully", books));
});

// get books by id
const getBookByIdHandler = AsyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }
  return res.status(200).json(new ApiResponse(200, "Book fetched successfully", book));
});

// update books
const updateBoookHandler = AsyncHandler(async (req, res) => {
  const bookId = req.params.id;

  const {
    title,
    description,
    genre,
    price,
    stock,
  } = req.body;

  let coverImageUrl;
  let uploadImages;
  const coverImage = req?.files?.coverImage[0];
  if (coverImage) {
    coverImageUrl = await uploadToCloudinary(coverImage);
  }
  const images = req?.files?.images;
  if (images) {
    uploadImages = await Promise.all(images.map(async (image) => {
      const imageUrl = await uploadToCloudinary(image);
      return ({
        url: imageUrl?.url ?? "",
        mimeType: imageUrl?.mimetype ?? "",
        size: imageUrl?.size ?? 0,
      });
    }));
  }
  const book = await Book.findByIdAndUpdate(bookId, {
    title,
    description,
    genre,
    price,
    stock,
    ...(coverImageUrl && {
      coverImage: {
        url: coverImageUrl?.url ?? "",
        mimeType: coverImageUrl?.mimetype ?? "",
        size: coverImageUrl?.size ?? 0,
      },
    }),
    ...(uploadImages?.length > 0 && { images: uploadImages }),
  },
  { new: true });
  if (!book) {
    throw new ApiError(404, "Book update failed");
  }
  return res.status(200).json(new ApiResponse(200, "Book updated successfully", book));
});
// delete books
const deleteBookHandler = AsyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findByIdAndDelete(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }
  return res.status(200).json(new ApiResponse(200, "Book deleted successfully"));
});

export {
  createBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBoookHandler,
  deleteBookHandler,
};

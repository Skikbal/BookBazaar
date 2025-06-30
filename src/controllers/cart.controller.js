import { Cart } from "../models/cart.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import AsyncHandler from "../utils/asyncHandler.js";
import { Book } from "../models/book.model.js";

// add to cart
const addItemsToCartHandler = AsyncHandler(async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // if book already present in cart just increase the quantity
  if (cart.items.find((item) => {
    return item.bookId.toString() === bookId;
  })) {
    cart.items.find((item) => {
      item.bookId.toString() === bookId ? (item.quantity += quantity) : null;
      ;
    });
  }
  else {
    cart.items.push({ bookId, quantity });
  }

  await cart.save();

  return res.status(200).json(new ApiResponse(200, "Item added to cart successfully"));
});

// remove item from cart
const removeItemFromCartHandler = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  const { bookId } = req.params;
  // find index of item
  const index = cart.items.findIndex((item) => {
    return item.bookId.toString() === bookId;
  });
  if (index === -1) {
    throw new ApiError(404, "Item not found in cart");
  }
  else {
    cart.items.splice(index, 1);
    await cart.save();
    return res.status(200).json(new ApiResponse(200, "Item removed from cart successfully"));
  }
});

// update cart
const updateCartHandler = AsyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  const { bookId, quantity } = req.body;

  const index = cart.items.findIndex((c) => {
    return c.bookId.toString() === bookId;
  });

  if (index === -1) {
    throw new ApiError(404, "Item not found in cart");
  }
  else {
    cart.items[index].quantity = quantity;
    await cart.save();
    return res.status(200).json(new ApiResponse(200, "Item quantity updated successfully"));
  }
});

// get cart
const getUserCartHandler = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId });
  const books = await Promise.all(cart.items.map(async (item) => {
    const book = await Book.findById(item.bookId).select({ price: 1 });
    return { ...item._doc, price: book.price };
  }));

  const total = books.reduce((sum, item) => {
    return sum + (item.quantity * item.price);
  }, 0);
  cart.totalPrice = total;
  await cart.save();
  const cartDeatils = await Cart.findById(cart._id).populate({
    path: "items.bookId", select: "title coverImage price stock",
  });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }
  return res.status(200).json(new ApiResponse(200, "Cart fetched successfully", cartDeatils));
});
export {
  addItemsToCartHandler,
  removeItemFromCartHandler,
  updateCartHandler,
  getUserCartHandler,
};

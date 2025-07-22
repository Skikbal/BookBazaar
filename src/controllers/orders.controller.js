import AsyncHandler from "../utils/asyncHandler.js";
import { Order } from "../models/order.model.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { Book } from "../models/book.model.js";
import mongoose from "mongoose";
import razorpay from "../config/razorPay.js";
import { RAZORPAY_APIKEY } from "../config/envConfig.js";
// create order
const createOrderHandler = AsyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;
  // fetch books in one query
  const bookIds = items.map((item) => {
    return item.bookId;
  });

  const booksToOrder = await Book.find({ _id: { $in: bookIds }, stock: { $gt: 0 } });
  if (!booksToOrder.length === items.length) {
    throw new ApiError(404, "Some books not found");
  }

  const orderItemsPrice = items.map((item) => {
    const book = booksToOrder.find((book) => {
      return book._id.toString() === item.bookId;
    });

    if (!book) {
      throw new ApiError(404, "Book not found");
    }
    if (book.stock < item.quantity) {
      throw new ApiError(400, "Insufficient stock");
    }
    return book.price * item.quantity;
  });

  const total = await orderItemsPrice.reduce(
    (sum, price) => { return sum + price; },
    0);
  // integrate payment gateway
  const options = {
    amount: total * 100, // Convert amount to paise
    currency: "INR",
    receipt: "receipt_" + Math.random().toString(36).substring(7),
  };

  const order = await razorpay.orders.create(options);
  order.shippingAddress = shippingAddress[0];
  order.key = RAZORPAY_APIKEY;
  order.items = items;
  order.orderedBy = req.user._id;

  return res.status(200).json(new ApiResponse(201, "Payment initiated", order));
});

// get orders
const getUserOrdersHandler = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ orderedBy: userId });
  if (!orders) {
    throw new ApiError(404, "Orders not found");
  }
  return res.status(200).json(new ApiResponse(200, "Orders fetched successfully", orders));
});

// get order by id
const getOrderByIdHandler = AsyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(orderId) },
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "books",
        localField: "items.bookId",
        foreignField: "_id",
        as: "bookInfo",
      },
    },
    {
      $unwind: {
        path: "$bookInfo",
        preserveNullAndEmptyArrays: true, // in case no book match
      },
    },
    {
      $group: {
        _id: "$_id",
        orderedBy: { $first: "$orderedBy" },
        totalPrice: { $first: "$totalPrice" },
        status: { $first: "$status" },
        shippingAddress: { $first: "$shippingAddress" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        items: {
          $push: {
            _id: "$items._id",
            quantity: "$items.quantity",
            bookId: "$items.bookId",
            book: "$bookInfo",
          },
        },
      },
    },
  ]);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return res.status(200).json(new ApiResponse(200, "Order fetched successfully", order));
});

export {
  createOrderHandler,
  getUserOrdersHandler,
  getOrderByIdHandler,
};

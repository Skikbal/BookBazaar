import AsyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import path from "path";
import { fileURLToPath } from "url";
import { RAZORPAY_SECRETKEY } from "../config/envConfig.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Book } from "../models/book.model.js";
import { Payment } from "../models/payment.model.js";

// These two lines create __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const paymentHandler = AsyncHandler(async (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/static/index.html"));
});

const verifyPaymentHandler = AsyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order } = req.body;

  const secret = RAZORPAY_SECRETKEY;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
  if (isValidSignature) {
    // Update the order with payment details
    const session = await mongoose.startSession();
    session.startTransaction();
    let orderDetails;
    let payment;
    try {
      const createOrder = await Order.create([{
        items: order.items,
        shippingAddress: order.shippingAddress,
        totalPrice: (order.amount) / 100,
        orderedBy: order.orderedBy,
      }], { session });

      orderDetails = createOrder[0];
      if (!order) {
        throw new ApiError(500, "Failed to create order");
      }

      await Promise.all(
        orderDetails.items.map(async (item) => {
          await Book.findByIdAndUpdate(item.bookId, {
            $inc: { stock: -item.quantity },
          }, { session });
        }));

      payment = await Payment.create([{
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        amount: orderDetails.totalPrice,
        currency: orderDetails.currency,
        status: "successful",
        user: orderDetails.orderedBy,
        orderRef: orderDetails._id,
      }], { session });
      if (!payment) {
        throw new ApiError(500, "Failed to create payment");
      }
      await session.commitTransaction();
    }
    catch (error) {
      await session.abortTransaction();
      throw new ApiError(500, "Failed to create order", error);
    }
    finally {
      session.endSession();
    }

    return res.status(200).json(new ApiResponse(201, "Payment initiated", { orderDetails, payment }));
  }
  else {
    return res.status(400).json(new ApiResponse(400, "Payment verification failed"));
  }
});

export { paymentHandler, verifyPaymentHandler };

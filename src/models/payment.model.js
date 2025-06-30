import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
    razorpay_signature: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "successful", "failed"],
      default: "created",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // if you have an Order model
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = mongoose.model("Payment", paymentSchema);

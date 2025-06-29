import mongoose, { Schema } from "mongoose";
import { orderStatusEnum, availbaleOrderStatus } from "../constants/constants.js";
const orderSchema = new Schema({
  items: [
    {
      bookId: {
        type: Schema.Types.ObjectId,
        ref: "Books",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  orderedBy: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  totalPrice: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: availbaleOrderStatus,
    default: orderStatusEnum.PENDING,
  },
  shippingAddress: [
    {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },
  ],

}, { timestamps: true });
export const Order = mongoose.model("Orders", orderSchema);

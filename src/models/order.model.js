import mongoose, { Schema } from "mongoose";
import { orderStatusEnum, availbaleOrderStatus } from "../constants/constants.js";
const orderSchema = new Schema({
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Books",
      required: true,
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
  shippingAddress: {
    type: String,
    required: true,
  },

}, { timestamps: true });
export const Order = mongoose.model("Orders", orderSchema);

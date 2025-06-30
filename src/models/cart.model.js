import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  items: [
    { _id: false,
      bookId: {
        type: Schema.Types.ObjectId,
        ref: "Books",
      },
      quantity: {
        type: Number,
        min: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
});

export const Cart = mongoose.model("Carts", cartSchema);

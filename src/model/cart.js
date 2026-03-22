import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    required: true,
    type: Number,
    default: 1,
  },
  color: {
    type: String,
    default: "",
  },
});

export const Cart = mongoose.models.carts || mongoose.model("carts", cartSchema);

import mongoose from "mongoose";

// Schema cho từng item trong giỏ hàng
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
});

// Schema cho giỏ hàng của một user
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, 
    },
    items: [cartItemSchema], 
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

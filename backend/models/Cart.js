import mongoose from "mongoose";

// Schema cho từng item trong giỏ hàng
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // tham chiếu đến collection Product
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  size: {
    type: String, // ví dụ "S", "M", "L", "XL"
    required: true,
  },
  color: {
    type: String, // nếu muốn lưu màu sắc
  },
});

// Schema cho giỏ hàng của một user
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // mỗi user chỉ có 1 giỏ
    },
    items: [cartItemSchema], // mảng các sản phẩm
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;

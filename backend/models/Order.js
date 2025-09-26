import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price:    { type: Number, required: true },
    size:     { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    orderItems: { type: [orderItemSchema], required: true },

    shippingAddress: {
      fullName: { type: String, required: true },
      phone:    { type: String, required: true },
      address:  { type: String, required: true },
      city:     { type: String, required: true },
    },

    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Chờ xử lý", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"],
      default: "Chờ xử lý",
    },
   
    paymentMethod: {
      type: String,
      enum: ["COD", "MOMO"],
      default: "COD",
      required: true,
    },
    
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded"],
      default: "unpaid",
      required: true,
    },

 
    paidAt: { type: Date },

    transactionId: { type: String },

    paymentInfo: {
      provider:  { type: String }, 
      payType:   { type: String }, 
      response:  { type: Object }, 
      signature: { type: String },
      requestId: { type: String }, 
      orderIdPG: { type: String }, 
    },
  },
  { timestamps: true }
);

orderSchema.virtual("isPaid").get(function () {
  return this.paymentStatus === "paid";
});

orderSchema.index({ createdAt: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;

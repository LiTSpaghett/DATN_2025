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

    // Tổng tiền tại thời điểm đặt hàng
    totalPrice: { type: Number, required: true },

    // Trạng thái xử lý đơn (logistics)
    status: {
      type: String,
      enum: ["Chờ xử lý", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"],
      default: "Chờ xử lý",
    },
    // Phương thức thanh toán
    paymentMethod: {
      type: String,
      enum: ["COD", "MOMO"],
      default: "COD",
      required: true,
    },

    // Trạng thái thanh toán
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded"],
      default: "unpaid",
      required: true,
    },

    // Thời điểm thanh toán xong
    paidAt: { type: Date },

    // Mã giao dịch từ cổng thanh toán
    transactionId: { type: String },

    // Thông tin chi tiết từ cổng thanh toán (để đối soát/debug)
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

// Virtual tiện dụng
orderSchema.virtual("isPaid").get(function () {
  return this.paymentStatus === "paid";
});

// Index phục vụ truy vấn/thống kê
orderSchema.index({ createdAt: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;

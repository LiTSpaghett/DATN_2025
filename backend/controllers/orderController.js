// controllers/orderController.js
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Tạo đơn hàng từ giỏ hàng
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,   // chỉ lưu productId
      quantity: item.quantity,
      size: item.size || null,
      price: item.product.price,
    }));

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = new Order({
      user: req.user._id,
      shippingAddress,
      orderItems,
      totalPrice,
    });

    await order.save();

    // Xoá giỏ hàng sau khi đặt hàng
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Order create error:", err);
    res.status(500).json({ message: err.message });
  }
};
// Lấy đơn hàng của user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name image price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Admin: Lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name image price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Admin: Cập nhật trạng thái
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    const validStatuses = ["Chờ xử lý", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

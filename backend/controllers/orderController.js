import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

const ALLOWED_METHODS = ["COD", "MOMO"];

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "COD" } = req.body || {};

    // Validate địa chỉ
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      return res.status(400).json({ message: "Thiếu thông tin địa chỉ giao hàng" });
    }

    // Validate method
    if (!ALLOWED_METHODS.includes(paymentMethod)) {
      return res.status(400).json({ message: "Phương thức thanh toán không hợp lệ" });
    }

    // Lấy giỏ hàng của user
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // Chụp snapshot items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,  
      quantity: item.quantity,
      size: item.size || null,
      price: item.product.price,  
    }));

  
    const totalPrice = orderItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
   
    const initialPaymentStatus = paymentMethod === "MOMO" ? "pending" : "unpaid";

    // Tạo order
    const order = new Order({
      user: req.user._id,
      shippingAddress,
      orderItems,
      totalPrice,
      paymentMethod,            
      paymentStatus: initialPaymentStatus, 
  
    });

    await order.save();

    // Xoá sạch giỏ hàng sau khi tạo đơn
    cart.items = [];
    await cart.save();

    return res.status(201).json(order);
  } catch (err) {
    console.error("Order create error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Lấy đơn hàng của user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name image price")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Admin: Lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name image price")
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Admin: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Chờ xử lý", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    order.status = status;
    await order.save();

    return res.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

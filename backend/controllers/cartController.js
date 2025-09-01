import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Lấy giỏ hàng của user
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) return res.status(404).json({ message: "Chưa có giỏ hàng" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm sản phẩm vào giỏ
export const addToCart = async (req, res) => {
  const { productId, quantity, size } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Tạo giỏ hàng mới nếu chưa có
      cart = new Cart({
        user: req.user._id,
        items: [{ product: productId, quantity, size }],
      });
    } else {
      // Kiểm tra sản phẩm + size đã có trong giỏ chưa
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId && item.size === size
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, size });
      }
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ
export const removeFromCart = async (req, res) => {
  const { productId, size } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    cart.items = cart.items.filter(
      (item) => !(item.product.toString() === productId && item.size === size)
    );

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật số lượng
export const updateQuantity = async (req, res) => {
  const { productId, size, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const populatedCart = await cart.populate("items.product");
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: "Sản phẩm không có trong giỏ" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// import Cart from "../models/cartModel.js";

// export const loadUserCart = async (req, res, next) => {
//   try {
//     const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Giỏ hàng trống" });
//     }

//     req.userCart = cart;
//     next();
//   } catch (err) {
//     console.error("Load cart error:", err);
//     res.status(500).json({ message: "Không thể load giỏ hàng" });
//   }
// };

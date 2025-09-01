import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js"; // middleware xác thực user

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.put("/update", protect, updateQuantity);
router.delete("/remove", protect, removeFromCart);

export default router;

// routes/orderRoutes.js
import express from "express";
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// User
router.post("/", protect, createOrder);
router.get("/mine", protect, getMyOrders);

// Admin
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);

export default router;

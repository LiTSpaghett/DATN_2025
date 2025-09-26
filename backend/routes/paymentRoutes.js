// routes/paymentRoutes.js
import express from "express";
import { createMomoPayment, momoIpnHandler } from "../controllers/momoController.js";
// import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();
router.post("/momo/create", /* authMiddleware, */ createMomoPayment);
router.post("/momo/ipn", momoIpnHandler);
export default router;

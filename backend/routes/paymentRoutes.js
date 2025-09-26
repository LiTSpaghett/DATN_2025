import express from "express";
import { createMomoPayment, momoIpnHandler } from "../controllers/momoController.js";


const router = express.Router();
router.post("/momo/create", createMomoPayment);
router.post("/momo/ipn", momoIpnHandler);
export default router;

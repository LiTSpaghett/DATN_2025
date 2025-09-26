// routes/adminRoutes.js
import express from "express";
// import { protect, admin } from "../middleware/auth.js";
import { getAdminStatsAll } from "../controllers/adminStatsController.js";

const router = express.Router();


router.get("/", getAdminStatsAll);


export default router;
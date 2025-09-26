import express from "express";
import { getAdminStatsAll } from "../controllers/adminStatsController.js";

const router = express.Router();


router.get("/", getAdminStatsAll);


export default router;
import express from "express";
import { login as adminLogin, getProfile as getAdminProfile, getAllProfile,deleteUser, changeUserRole } from "../controllers/adminAuthController.js";
import { protectAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Admin profile
router.get("/profile", getAdminProfile);
router.get("/allprofiles", getAllProfile);
router.put("/:id/role", changeUserRole);
router.delete("/:id", deleteUser);
export default router;

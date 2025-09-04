import express from "express";
import multer from "multer";
import { protect, admin } from "../middleware/authMiddleware.js";
import { uploaded } from "../controllers/uploadController.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, "uploads/"); },
  filename(req, file, cb) { cb(null, `${Date.now()}-${file.originalname}`); }
});
const upload = multer({ storage });

router.post("/", protect, admin, upload.single("image"), uploaded);
export default router;

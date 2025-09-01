import express from "express";
import multer from "multer";
import {
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// multer (upload ảnh)
const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, "uploads/"); },
  filename(req, file, cb) { cb(null, `${Date.now()}-${file.originalname}`); }
});
const upload = multer({ storage });

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", upload.single("image"), createProduct);
router.put("/:id",  upload.single("image"), updateProduct);
// router.delete("/:id",protect, admin, deleteProduct);
router.delete("/:id", deleteProduct);
export default router;

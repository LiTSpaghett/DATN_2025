import express from "express";
import multer from "multer";
import {
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getFilters
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
router.get("/filters", getFilters);
router.get("/:id", getProductById);



router.post("/", upload.single("images"), createProduct);
router.put("/:id",  upload.single("images"), updateProduct);
// router.delete("/:id",protect, admin, deleteProduct);
router.delete("/:id", deleteProduct);
export default router;

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import  productRoutes  from "./routes/productRoutes.js";
import  orderRoutes from "./routes/orderRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store"); // luôn trả về dữ liệu mới
  next();
});
// static serve upload folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


// APIs
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/stats", statsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chat", (await import("./routes/chatRoutes.js")).default); 
// error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

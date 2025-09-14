import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

dotenv.config();
await connectDB();

await User.deleteMany();
await Product.deleteMany();

const admin = await User.create({
  name: "Admin",
  email: "admin@example.com",
  password: "123456",
  isAdmin: true
});

await Product.insertMany([
   {
    name: "Áo khoác Uniqlo",
    description: "Áo khoác nam phong cách Hàn Quốc, chất liệu nhẹ",
    price: 599000,
    category: "Áo khoác",
    subcategory: "Áo khoác gió",
    colors: "Đen",
    images: ["aokhoac-uniqlo-den.jpg"],
    stock: [
      { size: "M", quantity: 10 },
      { size: "L", quantity: 5 },
    ],
  },
  {
    name: "Áo thun basic",
    description: "Áo thun cotton 100%, thoáng mát",
    price: 199000,
    category: "Áo thun",
    subcategory: "Áo thun ngắn tay",
    colors: "Trắng",
    images: ["aothun-basic.jpg"],
    stock: [
      { size: "S", quantity: 20 },
      { size: "M", quantity: 15 },
    ],
  },
  {
    name: "Quần jean skinny",
    description: "Quần jean co giãn, ôm body",
    price: 399000,
    category: "Quần",
    subcategory: "Quần jean nam",
    colors: "Xanh",
    images: ["quanjean-skinny.jpg"],
    stock: [
      { size: "M", quantity: 12 },
      { size: "L", quantity: 8 },
    ],
  },
  {
    name: "Áo sơ mi công sở",
    description: "Áo sơ mi trắng dài tay, vải cotton thoáng mát",
    price: 299000,
    category: "Áo sơ mi",
    subcategory: "Áo sơ mi dài tay",
    colors: "Trắng",
    images: ["aosomi-trang.jpg"],
    stock: [
      { size: "M", quantity: 25 },
      { size: "L", quantity: 10 },
    ],
  },
  {
    name: "Váy hoa mùa hè",
    description: "Váy hoa nữ phong cách Hàn Quốc, dáng xòe",
    price: 499000,
    category: "Váy",
    subcategory: "Váy xòe",
    colors: "Hồng",
    images: ["vay-hoa-hong.jpg"],
    stock: [
      { size: "S", quantity: 18 },
      { size: "M", quantity: 10 },
    ],
  },
]);


console.log("✅ Seeded. Admin:", admin.email, "pw=123456");
mongoose.connection.close();
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
    name: "Áo thun trắng",
    description: "Cotton 100%",
    price: 199000,
    category: "Áo",
    colors: ["Trắng"],
    images: ["uploads/sample1.jpg"],
    stock: [
      { size: "S", quantity: 20 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 15 }
    ]
  },
  {
    name: "Quần jeans xanh",
    description: "Form Slim",
    price: 399000,
    category: "Quần",
    colors: ["Xanh"],
    images: ["uploads/sample2.jpg"],
    stock: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 10 },
      { size: "L", quantity: 10 }
    ]
  },
  {
    name: "Áo khoác đen",
    description: "Dáng bomber, ấm áp",
    price: 599000,
    category: "Áo",
    colors: ["Đen"],
    images: ["uploads/sample3.jpg"],
    stock: [
      { size: "M", quantity: 5 },
      { size: "L", quantity: 8 },
      { size: "XL", quantity: 7 }
    ]
  }
]);


console.log("✅ Seeded. Admin:", admin.email, "pw=123456");
mongoose.connection.close();

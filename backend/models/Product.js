import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    colors: {type: String, required: true},
    images: [{ type: String }],
    stock: [
      {
        size: { type: String, required: true },   // S, M, L, XL
        quantity: { type: Number, default: 0 }   // số lượng cho size đó
      }
    ],
    weaviateId: { type: String },
  },
  
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
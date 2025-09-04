import React from "react";
import ProductList from "../components/ProductList";

export default function Shop({ addToCart }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Bộ sưu tập</h2>
      <ProductList addToCart={addToCart} />
    </div>
  );
}
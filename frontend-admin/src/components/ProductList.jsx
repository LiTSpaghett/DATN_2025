import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function ProductList({ addToCart, searchTerm = "", filters = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Lấy sản phẩm thất bại:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Đang tải sản phẩm...</p>;

  // 🔍 Lọc sản phẩm theo tên (searchTerm) và category (filters.categories)
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      !filters.categories || filters.categories.length === 0
        ? true
        : filters.categories.includes(p.category);

    return matchSearch && matchCategory;
  });

  if (filteredProducts.length === 0)
    return <p>❌ Không tìm thấy sản phẩm</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((p) => (
        <ProductCard key={p._id} product={p} addToCart={addToCart} />
      ))}
    </div>
  );
}

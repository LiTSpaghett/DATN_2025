import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function ProductList({ addToCart, searchTerm = "", filters = {} }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 8; // số sản phẩm / trang

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          params: {
            search: searchTerm,
            category: filters.categories?.length > 0 ? filters.categories[0] : "",
            page,
            limit,
          },
        });
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error("❌ Lấy sản phẩm thất bại:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchTerm, filters, page]);

  if (loading) return <p>Đang tải sản phẩm...</p>;

  if (!products || products.length === 0) return <p>❌ Không tìm thấy sản phẩm</p>;

  return (
    <div>
      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} addToCart={addToCart} />
        ))}
      </div>

      {/* Phân trang */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ⬅ Trước
        </button>
        <span className="px-4 py-1">
          Trang {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau ➡
        </button>
      </div>
    </div>
  );
}

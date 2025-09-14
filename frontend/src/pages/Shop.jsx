import React, { useState, useEffect } from "react";
import ProductList from "../components/ProductList";
import Chatbot from "../components/ChatBot";
import { MessageCircle } from "lucide-react";
import axios from "axios";

export default function Shop({ addToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ categories: [] });
  const [products, setProducts] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [categories, setCategories] = useState([]);

  // Gọi API lấy sản phẩm theo filter
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products", {
        params: {
          category: filters.categories.length > 0 ? filters.categories[0] : "", // chỉ gửi 1 category
          search: searchTerm,
        },
      });
      setProducts(data.products);
    } catch (err) {
      console.error("❌ Lỗi tải sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, searchTerm]);

  const handleCategoryChange = (category) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category) // bỏ chọn
        : [category]; // chỉ giữ 1 category được chọn
      return { ...prev, categories };
    });
  };

    useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products/filters");
        setCategories(data.categories || []); // chỉ lấy categories
      } catch (err) {
        console.error("❌ Lỗi lấy categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
      {/* Sidebar bộ lọc */}
      <aside className="md:col-span-1">
        <h3 className="font-bold mb-4">FILTERS</h3>
        <div className="border p-4 rounded mb-4">
          <h4 className="font-semibold mb-2">CATEGORIES</h4>
          {categories.map((cat) => (
            <label key={cat} className="block">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
                className="mr-2"
              />
              {cat}
            </label>
          ))}
        </div>
        <button
          onClick={() => setFilters({ categories: [] })}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </aside>

      {/* Nội dung chính */}
      <main className="md:col-span-3">
        <h2 className="text-2xl font-bold mb-6">Bộ sưu tập</h2>

        {/* Thanh tìm kiếm */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Tìm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />
        </div>

        <ProductList
          addToCart={addToCart}
          searchTerm={searchTerm}
          filters={filters}
        />

      </main>

      {/* Nút tròn mở chat */}
      <button
        onClick={() => setShowChat((prev) => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
      >
        <MessageCircle size={28} />
      </button>

      {/* Hộp chat */}
      {showChat && <Chatbot onClose={() => setShowChat(false)} />}
    </div>
  );
}

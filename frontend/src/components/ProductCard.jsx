
import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const productImage = product.images?.[0] || "placeholder.jpg";

  const handleAddToCart = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        alert("Vui lòng đăng nhập!");
        return;
      }

      const defaultSize = product.stock?.[0]?.size;
      if (!defaultSize) {
        alert("Sản phẩm này hiện không có size sẵn");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: product._id, size: defaultSize, quantity: 1 },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      console.log("Giỏ hàng cập nhật:", res.data);
      alert(`${product.name} (size ${defaultSize}) đã được thêm vào giỏ hàng!`);
    } catch (err) {
      console.error(err);
      alert("Thêm vào giỏ hàng thất bại!");
    }
  };

  const goToDetail = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <motion.div whileHover={{ y: -6 }} className="product-card bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <div className="relative cursor-pointer" onClick={goToDetail}>
        <img src={`http://localhost:5000/${productImage}`} alt={product.name} className="w-full h-72 object-cover" />
        <div className="absolute top-3 left-3 bg-white/80 text-sm text-pink-600 px-2 py-1 rounded">Mới</div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition flex items-end justify-center p-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
            className="bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-pink-600 font-bold mt-2">{product.price.toLocaleString()} đ</p>
          {/* Hiển thị stock theo size */}
          {product.stock && product.stock.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Sẵn có: {product.stock.map(s => `${s.size} (${s.quantity})`).join(", ")}
            </p>
          )}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-pink-500 text-white py-2 rounded-lg shadow hover:bg-pink-600"
          >
            Mua ngay
          </button>
          <button className="w-12 h-12 bg-white border rounded-lg flex items-center justify-center">❤</button>
        </div>
      </div>
    </motion.div>
  );
}

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ProductDetail({ fetchCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);

        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
        else if (data.image) {
          setSelectedImage(data.image);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Đang tải...</div>;

  const availableSizes = product.stock?.filter(s => s.quantity > 0) || [];

  const handleAddToCart = async () => {
    if (!userInfo) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }
    if (!selectedSize) {
      alert("Vui lòng chọn size");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId: product._id,
          quantity: 1,
          size: selectedSize,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      alert("Đã thêm vào giỏ hàng");
      fetchCart?.(); 
    } catch (err) {
      console.error(err);
      alert("Thêm vào giỏ hàng thất bại");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* Ảnh sản phẩm */}
      <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-2xl overflow-hidden">
        <img
          src={`http://localhost:5000/${selectedImage || product.images[0]}`}
          // alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex flex-col justify-between bg-white rounded-2xl shadow-lg p-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-pink-600 font-bold text-2xl mb-4">
            {product.price?.toLocaleString()} đ
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="font-semibold">Chọn size: </span>
            <div className="flex gap-2 mt-2">
              {availableSizes.length > 0 ? (
                availableSizes.map(s => (
                  <button
                    key={s.size}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === s.size
                        ? "bg-pink-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                    onClick={() => setSelectedSize(s.size)}
                  >
                    {s.size} ({s.quantity})
                  </button>
                ))
              ) : (
                <span className="text-red-500">Hết hàng</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-pink-500 text-white py-3 rounded-lg shadow hover:bg-pink-600"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}

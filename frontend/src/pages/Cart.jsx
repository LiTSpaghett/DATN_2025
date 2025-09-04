import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";


export default function CartPage() {
  
  const [cartItems, setCartItems] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const fetchCart = async () => {
    if (!userInfo) return;
    try {
      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setCartItems(data.items);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, size, newQty) => {
    if (newQty < 1) return;

    setCartItems(prev =>
      prev.map(item =>
        item.product._id === productId && item.size === size
          ? { ...item, quantity: newQty }
          : item
      )
    );

    try {
      await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, size, quantity: newQty },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  const removeFromCart = async (productId, size) => {
    setCartItems(prev =>
      prev.filter(item => !(item.product._id === productId && item.size === size))
    );

    try {
      await axios.delete(
        "http://localhost:5000/api/cart/remove",
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
          data: { productId, size },
        }
      );
    } catch (err) {
      console.error(err);
      fetchCart();
    }
  };

  const total = cartItems.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h2>

      {cartItems.length === 0 ? (
        <div className="p-8 bg-white rounded-lg text-center shadow">
          <p>Giỏ hàng trống.</p>
          <Link to="/shop" className="mt-4 inline-block bg-pink-500 text-white px-4 py-2 rounded">
            Đi mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={`${item.product._id}-${item.size}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  layout
                  className="flex items-center gap-4 bg-white p-4 rounded-lg shadow"
                >
                  <img
                     src={`http://localhost:5000/${item.product.images[0].replace(/\\/g, "/")}`}
                    alt={item.product.name}
                    className="w-24 h-28 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">{item.product.price.toLocaleString()} đ</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.size, item.quantity - 1)
                        }
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.size, item.quantity + 1)
                        }
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{(item.product.price * item.quantity).toLocaleString()} đ</div>
                      <button
                        onClick={() => removeFromCart(item.product._id, item.size)}
                        className="text-red-500 text-sm mt-1"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="bg-white p-4 rounded-lg shadow">
            <div className="text-lg font-semibold">Tổng</div>
            <div className="text-2xl font-bold my-4">{total.toLocaleString()} đ</div>
            <Link
    to="/checkout"
    className="block text-center w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
  >
    Thanh toán
  </Link>
          </aside>
        </div>
      )}
    </div>
  );
}

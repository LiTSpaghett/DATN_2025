import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo) {
          setError("Bạn cần đăng nhập để xem đơn hàng");
          setLoading(false);
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/orders/mine", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusColors = {
    pending: "bg-yellow-200 text-yellow-800",
    confirmed: "bg-blue-200 text-blue-800",
    shipping: "bg-purple-200 text-purple-800",
    delivered: "bg-green-200 text-green-800",
    cancelled: "bg-red-200 text-red-800",
  };

  if (loading) return <p className="text-center py-10">Đang tải đơn hàng...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (orders.length === 0) return <p className="text-center py-10">Bạn chưa có đơn hàng nào</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Theo dõi đơn hàng</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Mã đơn: {order._id}</h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[order.status] || "bg-gray-200 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-gray-600 mb-2">
              Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>

            <div className="mb-3">
              <h3 className="font-medium">Sản phẩm:</h3>
              <ul className="list-disc ml-6 text-gray-700">
                {order.orderItems.map((item, idx) => (
                    <li key={idx}>
                    {item.product?.name || item.name} 
                    {item.size ? ` (Size: ${item.size})` : ""} × {item.quantity} ={" "}
                    {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </li>
                ))}
                </ul>
            </div>

            <p className="font-semibold">
              Tổng tiền: {order.totalPrice.toLocaleString("vi-VN")}₫
            </p>

            <p className="text-gray-700 mt-2">
              Địa chỉ: {order.shippingAddress.address} <br />
              SĐT: {order.shippingAddress.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

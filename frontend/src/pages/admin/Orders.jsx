import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // Lấy tất cả đơn hàng
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/orders"); 
      setOrders(data);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cập nhật trạng thái
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status: newStatus,
      });
      fetchOrders(); // reload lại sau khi cập nhật
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Danh sách đơn hàng</h2>
      <table className="w-full bg-white rounded shadow mt-4">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Khách hàng</th>
            <th className="p-2 border">Sản phẩm</th>
            <th className="p-2 border">Địa chỉ</th>
            <th className="p-2 border">Tổng tiền</th>
            <th className="p-2 border">Trạng thái</th>
            <th className="p-2 border">Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t">
              {/* Khách hàng */}
              <td className="p-2 border">
                <div>
                  <p className="font-medium">{order.user?.name}</p>
                  <p className="text-gray-500 text-xs">{order.user?.email}</p>
                </div>
              </td>

              {/* Sản phẩm */}
              <td className="p-2 border">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="mb-2">
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">
                      Size: {item.size || "-"} | SL: {item.quantity} | Giá: {item.price}₫
                    </p>
                  </div>
                ))}
              </td>

              {/* Địa chỉ giao hàng */}
              <td className="p-2 border">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.phone}</p>
                <p className="text-xs text-gray-500">
                  {order.shippingAddress.address}, {order.shippingAddress.city}
                </p>
              </td>

              {/* Tổng tiền */}
              <td className="p-2 border font-semibold text-red-500">
                {order.totalPrice.toLocaleString()}₫
              </td>

              {/* Trạng thái */}
              <td className="p-2 border">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </td>

              {/* Ngày đặt */}
              <td className="p-2 border text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

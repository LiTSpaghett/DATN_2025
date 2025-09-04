import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  const handleCheckout = async () => {
    if (!fullName || !phone || !address || !city) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        {
          shippingAddress: { fullName, phone, address, city },
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      alert("Đặt hàng thành công!");
      console.log("Order:", data);
      // // Reset form
      // setFullName("");
      // setPhone("");
      // setAddress("");
      // setCity("");
      navigate("/orderTracking");
    } catch (err) {
      console.error(err);
      alert("Đặt hàng thất bại");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Thông tin giao hàng</h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Họ và tên"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Thành phố"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          onClick={handleCheckout}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
}

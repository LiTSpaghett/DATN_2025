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

  const [paymentMethod, setPaymentMethod] = useState("COD"); 
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (!userInfo?.token) {
      alert("Bạn chưa đăng nhập.");
      navigate("/login");
      return;
    }
    if (!fullName || !phone || !address || !city) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    setSubmitting(true);
    try {
      
      const createRes = await axios.post(
        "http://localhost:5000/api/orders",
        {
          shippingAddress: { fullName, phone, address, city },
          paymentMethod, 
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      const order = createRes.data;
      if (paymentMethod === "MOMO") {
        const payRes = await axios.post(
          "http://localhost:5000/api/payments/momo/create",
          { orderId: order._id },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        if (payRes.data?.payUrl) {
          window.location.href = payRes.data.payUrl;
          return; 
        } else {
          alert("Không tạo được phiên thanh toán MoMo.");
          console.error("MoMo create error:", payRes.data);
        }
      } else {
       
        alert("Đặt hàng thành công!");
        navigate("/ordertracking"); 
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Đặt hàng thất bại";
      alert(msg);
    } finally {
      setSubmitting(false);
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

        {/* Phương thức thanh toán */}
        <div className="border rounded-lg p-4">
          <div className="font-semibold mb-3">Phương thức thanh toán</div>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <span>Thanh toán khi nhận hàng (COD)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="MOMO"
                checked={paymentMethod === "MOMO"}
                onChange={() => setPaymentMethod("MOMO")}
              />
              <span>Ví MoMo</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={submitting}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-60"
        >
          {submitting ? "Đang xử lý..." : "Đặt hàng"}
        </button>
      </div>
    </div>
  );
}

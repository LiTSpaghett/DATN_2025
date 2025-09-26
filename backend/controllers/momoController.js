// controllers/momoController.js
import crypto from "crypto";
import axios from "axios";
import Order from "../models/Order.js";

/**
 * POST /api/payments/momo/create
 * body: { orderId: string }  // _id của Order trong DB
 * return: { payUrl, momo }
 */
export const createMomoPayment = async (req, res) => {
  try {
    const { orderId } = req.body || {};
    if (!orderId) return res.status(400).json({ message: "Thiếu orderId" });

    // 1) Lấy đơn hàng từ DB (nếu có auth, bạn có thể filter thêm { user: req.user._id })
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // 2) Tham số môi trường MoMo
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey   = process.env.MOMO_ACCESS_KEY;
    const secretkey   = process.env.MOMO_SECRET_KEY;
    const endpoint    = process.env.MOMO_ENDPOINT_CREATE;
    const redirectUrl = process.env.MOMO_REDIRECT_URL ;
    const ipnUrl      = process.env.MOMO_IPN_URL ;

    // 3) Lấy amount & orderInfo từ Order
    const amountInt   = Math.max(0, Math.floor(order.totalPrice || 0)); // VND integer
    const amountStr   = String(amountInt);
    const orderInfo   = `Thanh toán đơn #${order._id}`;

    // 4) requestId/orderId theo mẫu MoMo
    const requestId   = partnerCode + Date.now();
    const momoOrderId = String(order._id); // gửi chính _id làm orderId cho MoMo
    const requestType = "captureWallet";
    const extraData   = "";

    // 5) rawSignature (GIỮ ĐÚNG THỨ TỰ)
    const rawSignature =
      "accessKey=" + accessKey +
      "&amount=" + amountStr +
      "&extraData=" + extraData +
      "&ipnUrl=" + ipnUrl +
      "&orderId=" + momoOrderId +
      "&orderInfo=" + orderInfo +
      "&partnerCode=" + partnerCode +
      "&redirectUrl=" + redirectUrl +
      "&requestId=" + requestId +
      "&requestType=" + requestType;

    const signature = crypto.createHmac("sha256", secretkey)
      .update(rawSignature)
      .digest("hex");

    // 6) Payload và gọi MoMo
    const payload = {
      partnerCode, accessKey, requestId,
      amount: amountStr, orderId: momoOrderId, orderInfo,
      redirectUrl, ipnUrl, extraData, requestType, signature,
      lang: "vi",
    };

    const { data } = await axios.post(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
      validateStatus: () => true,
    });

    // 7) Nếu tạo thành công → lưu trạng thái đơn và trả payUrl
    if (data?.resultCode === 0 && data?.payUrl) {
      order.paymentMethod = "MOMO";
      order.paymentStatus = "pending"; // chờ MoMo xác nhận qua IPN
      order.paymentInfo = {
        ...(order.paymentInfo || {}),
        provider: "MOMO",
        requestId,
        orderIdPG: momoOrderId,
        response: data, // optional: lưu để đối soát
      };
      await order.save();

      return res.json({ payUrl: data.payUrl, momo: data });
    }

    return res.status(400).json({
      message: "Tạo thanh toán MoMo thất bại",
      momo: data,
    });
  } catch (err) {
    const msg = err.response?.data?.message || err.message;
    console.error("createMomoPayment error:", msg);
    return res.status(500).json({ message: "Server error", error: msg });
  }
};

// POST /api/payments/momo/ipn
export const momoIpnHandler = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      partnerCode, accessKey, requestId, amount, orderId, orderInfo,
      requestType, extraData = "", signature, resultCode, message,
      transId, payType,
    } = body;

    // Verify chữ ký theo đúng format đã ký khi gửi đi
    const raw =
      "accessKey=" + accessKey +
      "&amount=" + amount +
      "&extraData=" + extraData +
      "&ipnUrl=" + (process.env.MOMO_IPN_URL || "") +
      "&orderId=" + orderId +
      "&orderInfo=" + orderInfo +
      "&partnerCode=" + partnerCode +
      "&redirectUrl=" + (process.env.MOMO_REDIRECT_URL || "") +
      "&requestId=" + requestId +
      "&requestType=" + requestType;

    const expected = crypto.createHmac("sha256", process.env.MOMO_SECRET_KEY)
      .update(raw)
      .digest("hex");

    if (expected !== signature) {
      // vẫn trả 200 để MoMo không retry quá nhiều, nhưng báo nhận biết lỗi
      return res.json({ resultCode: 0, message: "Invalid signature (logged)" });
    }

    // orderId chính là _id của Order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ resultCode: 0, message: "Order not found (logged)" });
    }

    if (Number(resultCode) === 0) {
      order.paymentMethod = "MOMO";
      order.paymentStatus = "paid";
      order.paidAt = new Date();
      order.transactionId = String(transId || "");
    } else {
      order.paymentMethod = "MOMO";
      order.paymentStatus = "failed";
    }

    order.paymentInfo = {
      ...(order.paymentInfo || {}),
      provider: "MOMO",
      payType,
      response: body,
      requestId,
      orderIdPG: orderId,
      signature,
    };
    await order.save();

    return res.json({ resultCode: 0, message: "IPN received" });
  } catch (err) {
    console.error("momoIpnHandler error:", err.message);
    return res.json({ resultCode: 0, message: "IPN handled (error logged)" });
  }
};

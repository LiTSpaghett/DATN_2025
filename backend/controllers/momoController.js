// controllers/momoController.js
import crypto from "crypto";
import axios from "axios";
import Order from "../models/Order.js";


export const createMomoPayment = async (req, res) => {
  try {
    const { orderId } = req.body || {};
    if (!orderId) return res.status(400).json({ message: "Thiếu orderId" });

   
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    
    const accessKey   = process.env.MOMO_ACCESS_KEY;
    const secretkey   = process.env.MOMO_SECRET_KEY;
    const endpoint    = process.env.MOMO_ENDPOINT_CREATE;
    const redirectUrl = process.env.MOMO_REDIRECT_URL ;
    const ipnUrl      = process.env.MOMO_IPN_URL ;

   
    const amountInt   = Math.max(0, Math.floor(order.totalPrice || 0)); 
    const amountStr   = String(amountInt);
    const orderInfo   = `Thanh toán đơn #${order._id}`;

    
    const requestId   = partnerCode + Date.now();
    const momoOrderId = String(order._id); 
    const requestType = "captureWallet";
    const extraData   = "";

    
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

    
    if (data?.resultCode === 0 && data?.payUrl) {
      order.paymentMethod = "MOMO";
      order.paymentStatus = "pending"; 
      order.paymentInfo = {
        ...(order.paymentInfo || {}),
        provider: "MOMO",
        requestId,
        orderIdPG: momoOrderId,
        response: data, 
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


export const momoIpnHandler = async (req, res) => {
  try {
    const body = req.body || {};
    const {
      partnerCode, accessKey, requestId, amount, orderId, orderInfo,
      requestType, extraData = "", signature, resultCode, message,
      transId, payType,
    } = body;

    
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
      
      return res.json({ resultCode: 0, message: "Invalid signature (logged)" });
    }

    
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

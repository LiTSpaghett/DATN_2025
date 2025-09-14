
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const adminInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!adminInfo) {
    // chưa đăng nhập admin
    return <Navigate to="/admin/login" />;
  }

  if (!adminInfo.isAdmin) {
    // đăng nhập nhưng không phải admin
    return <Navigate to="/" />;
  }

  // ✅ Đúng admin -> cho vào
  return <Outlet />;
}

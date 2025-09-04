import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

   if (!userInfo) {
    // chưa đăng nhập
    return <Navigate to="/login" />;
  }

  if (!userInfo.isAdmin) {
    // đăng nhập nhưng không phải admin
    return <Navigate to="/" />;
  }

  // admin -> cho vào
  return <Outlet />;
}
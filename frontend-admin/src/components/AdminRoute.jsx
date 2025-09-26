
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const adminInfo = JSON.parse(localStorage.getItem("userInfo"));

  if (!adminInfo) {
    return <Navigate to="/login" />;
  }

  if (!adminInfo.isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/AdminLayout"; 
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import AdminLogin from "./pages/AdminLogin";


const STORAGE_KEY = "shop_cart_v1";

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  return (
    <Router>
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/*" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="users" element={<Users />} />
              </Route>
            </Route>
          </Routes>
        {/* </main> */}
      {/* </div> */}
    </Router>
  );
}

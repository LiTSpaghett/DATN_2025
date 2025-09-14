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

  // const addToCart = (product) => {
  //   setCart((prev) => {
  //     const found = prev.find((p) => p.id === product.id);
  //     if (found)
  //       return prev.map((p) =>
  //         p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
  //       );
  //     return [...prev, { ...product, quantity: 1 }];
  //   });
  // };

  // const updateQuantity = (id, qty) => {
  //   setCart((prev) => {
  //     if (qty <= 0) return prev.filter((p) => p.id !== id);
  //     return prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p));
  //   });
  // };

  // const removeFromCart = (id) => {
  //   setCart((prev) => prev.filter((p) => p.id !== id));
  // };

  // const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <Router>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute />}>
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

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CartPage from "./pages/Cart";
import Header from "./components/Header";
import CheckoutPage from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./pages/admin/AdminLayout"; 
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";


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

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found)
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p));
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <Router>
          <Routes>
             <Route
          path="/*"
          element={
            <div className="min-h-screen">
              <Header cartCount={cartCount} />
              <main className="max-w-7xl mx-auto py-8 px-4">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
                  <Route
              path="/cart"
              element={
                <CartPage
                  cartItems={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              }
             />
             <Route path="/Login" element={<Login />} />
             <Route path="/Register" element={<Register />} />
             <Route path="/checkout" element={<CheckoutPage cartItems={cart} setCart={setCart} />} />
              <Route path="/ordertracking" element={<OrderTracking />} />
                </Routes>
              </main>
            </div>
          }
        />
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

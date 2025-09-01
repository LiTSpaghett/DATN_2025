import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { UserContext } from "../components/UserContext";

export default function Header({ cartCount = 0 }) {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold">M</div>
          <div>
            <h1 className="text-lg font-bold">MON </h1>
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <NavLink to="/" className={({isActive}) => isActive ? 'text-pink-600 font-semibold' : 'text-gray-700'}>Home</NavLink>
          <NavLink to="/shop" className={({isActive}) => isActive ? 'text-pink-600 font-semibold' : 'text-gray-700'}>Shop</NavLink>
          <Link to="/cart" className="relative inline-flex items-center gap-2 px-3 py-2 rounded-md bg-pink-50 hover:bg-pink-100">
            <ShoppingCartIcon className="w-5 h-5 text-pink-600" />
            <span className="text-sm font-medium text-pink-700">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{cartCount}</span>
            )}
          </Link>
            <NavLink to="/ordertracking" className={({isActive}) => isActive ? 'text-pink-600 font-semibold' : 'text-gray-700'}>Đơn mua</NavLink>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-md bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
            >
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

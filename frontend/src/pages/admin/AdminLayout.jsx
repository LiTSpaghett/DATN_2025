// import { Link, Outlet } from "react-router-dom";

// const AdminLayout = () => {
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md">
//         <div className="p-4 border-b">
//           <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
//         </div>
//         <nav className="p-4 space-y-2">
//           <Link to="/admin" className="block px-3 py-2 rounded hover:bg-blue-100">📊 Dashboard</Link>
//           <Link to="/admin/products" className="block px-3 py-2 rounded hover:bg-blue-100">📦 Products</Link>
//           <Link to="/admin/orders" className="block px-3 py-2 rounded hover:bg-blue-100">📝 Orders</Link>
//           <Link to="/admin/users" className="block px-3 py-2 rounded hover:bg-blue-100">👤 Users</Link>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1">
//         {/* Header */}
//         <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
//           <h2 className="text-lg font-semibold">Admin Dashboard</h2>
//           <button className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
//         </header>

//         {/* Page Content */}
//         <div className="p-6">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const menu = [
    { to: "/admin", label: "📊 Dashboard" },
    { to: "/admin/products", label: "📦 Products" },
    { to: "/admin/orders", label: "📝 Orders" },
    { to: "/admin/users", label: "👤 Users" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        </div>
        <nav className="p-4 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`block px-3 py-2 rounded ${
                location.pathname === item.to
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              {userInfo?.name || "Admin"}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

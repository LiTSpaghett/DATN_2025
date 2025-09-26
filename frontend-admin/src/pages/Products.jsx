import { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  
  const [page, setPage] = useState(1);
  const limit = 10; 

 const fetchProducts = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/products");
    setProducts(data.products || []); 
  } catch (err) {
    console.error(err);
    setProducts([]);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  const formatStock = (stock) => {
    if (!stock || stock.length === 0) return "Hết hàng";
    return stock.map((s) => `${s.size}: ${s.quantity}`).join(", ");
  };

  // 🔍 Tìm kiếm
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📌 Cắt theo trang
  const totalPages = Math.ceil(filteredProducts.length / limit);
  const startIndex = (page - 1) * limit;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + limit);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📦 Quản lý sản phẩm</h1>

      {/* Ô tìm kiếm */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên hoặc danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <ProductForm
              product={editingProduct}
              onSuccess={() => {
                fetchProducts();
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Bảng sản phẩm */}
      <table className="w-full bg-white rounded shadow mt-4">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Tên SP</th>
            <th className="p-2 border">Màu</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Số lượng</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.colors}</td>
              <td className="p-2 border">{p.price.toLocaleString()} đ</td>
              <td className="p-2 border">{formatStock(p.stock)}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="px-3 py-1 bg-yellow-400 rounded"
                  onClick={() => {
                    setEditingProduct(p);
                    setShowForm(true);
                  }}
                >
                  Sửa
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => handleDelete(p._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
          {currentProducts.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                ⏳ Không tìm thấy sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 📌 Phân trang */}
      <div className="flex justify-center items-center gap-3 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ⬅ Trước
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Sau ➡
        </button>
      </div>
    </div>
  );
};

export default Products;

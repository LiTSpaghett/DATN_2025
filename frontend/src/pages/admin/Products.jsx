import { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data); 
    } catch (err) {
      console.error(err);
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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            if (showForm) {
              setShowForm(false);
              setEditingProduct(null);
            } else {
              setEditingProduct(null);
              setShowForm(true);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSuccess={() => {
            fetchProducts();
            setShowForm(false);
          }}
        />
      )}

      <table className="w-full bg-white rounded shadow mt-4">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Tên SP</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Số lượng</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.price.toLocaleString()} đ</td>
              <td className="p-2 border">{formatStock(p.stock)}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="px-3 py-1 bg-yellow-400 rounded"
                  onClick={() => {
                    if (showForm) {
                      setShowForm(false);
                      setEditingProduct(p);
                    } else {
                      setEditingProduct(p);
                      setShowForm(true);
                    }
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
          {filteredProducts.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                ⏳ Không tìm thấy sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Products;

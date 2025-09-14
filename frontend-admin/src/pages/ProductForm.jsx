import { useState } from "react";
import axios from "axios";

const ProductForm = ({ product, onSuccess }) => {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");
  const [colors, setColors] = useState(product?.colors || ""); // 1 màu chính
  const [category, setCategory] = useState(product?.category || "");
  const [subcategory, setSubcategory] = useState(product?.subcategory || ""); // ✅ thêm subcategory
  const [images, setImages] = useState([]); // nhiều ảnh
  const [stock, setStock] = useState(
    product?.stock || [
      { size: "S", quantity: 0 },
      { size: "M", quantity: 0 },
      { size: "L", quantity: 0 },
      { size: "XL", quantity: 0 },
    ]
  );

  // Thay đổi số lượng theo size
  const handleStockChange = (index, value) => {
    const updatedStock = [...stock];
    updatedStock[index].quantity = Number(value);
    setStock(updatedStock);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subcategory", subcategory); // ✅ thêm subcategory
      formData.append("colors", colors); // ✅ string, không JSON
      formData.append("stock", JSON.stringify(stock));

      // nhiều ảnh
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }

      if (product?._id) {
        await axios.put(`http://localhost:5000/api/products/${product._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✔️ Sửa sản phẩm thành công");
      } else {
        await axios.post("http://localhost:5000/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✔️ Thêm sản phẩm thành công");
      }

      onSuccess?.();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu sản phẩm");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 bg-gray-100 rounded">
      <input
        type="text"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Danh mục"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Danh mục con"
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Màu sắc chính"
        value={colors}
        onChange={(e) => setColors(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="number"
        placeholder="Giá"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full border p-2 rounded"
        required
      />
      <textarea
        placeholder="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      ></textarea>

      <div>
        <h4 className="font-semibold mb-1">Số lượng theo size:</h4>
        {stock.map((s, idx) => (
          <div key={s.size} className="flex items-center gap-2 mb-1">
            <label className="w-8">{s.size}:</label>
            <input
              type="number"
              value={s.quantity}
              min="0"
              onChange={(e) => handleStockChange(idx, e.target.value)}
              className="border p-1 rounded w-20"
            />
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setImages([...e.target.files])}
        className="w-full"
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {product?._id ? "Cập nhật" : "Thêm mới"}
      </button>
    </form>
  );
};

export default ProductForm;

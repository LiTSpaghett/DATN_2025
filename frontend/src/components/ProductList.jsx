// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import ProductCard from "./ProductCard";

// export default function ProductList({ addToCart }) {
//   const [products, setProducts] = useState([]); // khởi tạo là mảng
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/products");
//         // Nếu API trả về { products: [...] }, dùng res.data.products
//         setProducts(res.data.products || []); 
//         setLoading(false);
//       } catch (err) {
//         console.error("Lấy sản phẩm thất bại:", err);
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   if (loading) return <p>Đang tải sản phẩm...</p>;

//   if (!Array.isArray(products)) return <p>Không có sản phẩm</p>;

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//       {products.map(p => (
//         <ProductCard key={p._id} product={p} addToCart={addToCart} />
//       ))}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

export default function ProductList({ addToCart }) {
  const [products, setProducts] = useState([]); // khởi tạo là mảng
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        // API trả trực tiếp mảng products
        setProducts(res.data || []); 
      } catch (err) {
        console.error("Lấy sản phẩm thất bại:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Đang tải sản phẩm...</p>;
  if (!products.length) return <p>Không có sản phẩm</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} addToCart={addToCart} />
      ))}
    </div>
  );
}

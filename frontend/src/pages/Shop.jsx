// import React from "react";
// import ProductList from "../components/ProductList";

// export default function Shop({ addToCart }) {
//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-6">Bộ sưu tập</h2>
//       <ProductList addToCart={addToCart} />
//     </div>
//   );
// }

import React, { useState } from "react";
import ProductList from "../components/ProductList";

export default function Shop({ addToCart }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Bộ sưu tập</h2>

      {/* 🔍 Thanh tìm kiếm */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Tìm sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
      </div>

      {/* Truyền searchTerm xuống ProductList */}
      <ProductList addToCart={addToCart} searchTerm={searchTerm} />
    </div>
  );
}

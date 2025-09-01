import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y:0, opacity:1 }} transition={{ duration: .6 }} className="text-4xl font-bold mb-4">
          Thời trang đẹp — Tự tin tỏa sáng
        </motion.h2>
        <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y:0, opacity:1 }} transition={{ duration: .8 }} className="text-gray-600 mb-6">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non mollitia temporibus consequuntur a autem laudantium quia dolor voluptatem. Praesentium porro nulla quisquam in omnis expedita molestias atque ratione? Aspernatur, necessitatibus!
        </motion.p>
        <div className="flex gap-4">
          <Link to="/shop" className="bg-pink-500 text-white px-5 py-3 rounded-lg shadow hover:bg-pink-600">Mua ngay</Link>
          <a href="#features" className="px-5 py-3 rounded-lg border">Tìm hiểu</a>
        </div>
      </div>

      <motion.div initial={{ scale: .98, opacity: 0 }} animate={{ scale:1, opacity:1 }} transition={{ duration:.6 }} className="relative">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img src="https://picsum.photos/800/900?fashion" alt="hero" className="w-full object-cover" />
        </div>
      </motion.div>
    </div>
  );
}

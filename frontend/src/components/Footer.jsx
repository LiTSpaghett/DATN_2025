import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-10
                      flex flex-col md:flex-row items-center
                      justify-between gap-6 text-base text-gray-600">
        <div>© 2025 MON Clothing. All rights reserved.</div>

        <nav className="flex gap-6">
          <a href="#" className="hover:text-pink-600">Chính sách bảo mật</a>
          <a href="#" className="hover:text-pink-600">Điều khoản</a>
          <a href="#" className="hover:text-pink-600">Liên hệ</a>
        </nav>

        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-pink-600">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-600">
            <Instagram className="w-6 h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}

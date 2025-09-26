import { Mail, Phone, MapPin } from "lucide-react";

export default function ProfileView() {
  const user = {
    name: "Nguyễn Văn B",
    email: "nguyenvanb@example.com",
    phone: "+84 912 345 678",
    address: {
      address: "123 Trần Hưng Đạo, P.1",
      city: "TP. Hồ Chí Minh",
    },
    joinedAt: "2025-08-29",
  };

  const fmtDate = (s) =>
    new Date(s).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8">Hồ sơ của tôi</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thông tin tóm tắt */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-start gap-4 border">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-600 flex items-center justify-center font-bold text-xl">
              {user.name[0]}
            </div>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">Tham gia {fmtDate(user.joinedAt)}</p>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Mail size={16} /> {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} /> {user.phone}
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={16} /> {user.address.address}, {user.address.city}
              </div>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="bg-white rounded-xl shadow p-6 border md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Thông tin chi tiết</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <input
                  type="text"
                  value={user.email}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
                <input
                  type="text"
                  value={user.phone}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ngày tham gia</label>
                <input
                  type="text"
                  value={fmtDate(user.joinedAt)}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-600 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={`${user.address.address}, ${user.address.city}`}
                  readOnly
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* Nút lưu */}
            <div className="flex justify-end mt-6">
              <button className="px-6 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition">
                Lưu thông tin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

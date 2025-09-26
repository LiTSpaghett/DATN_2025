
import { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/admin/auth/allprofiles", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🗑 Xóa user
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/auth/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Đã xóa:", id);
      fetchUsers();
    } catch (err) {
      console.error("❌ Xóa thất bại:", err.response?.data || err.message);
      alert("Không có quyền admin hoặc token không hợp lệ");
    }
  };

  // 🔄 Đổi role user
  const handleChangeRole = async (id, isAdmin) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/auth/${id}/role`,
        { isAdmin }, // boolean true/false
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("✔️ Cập nhật role thành công");
      fetchUsers();
    } catch (err) {
      console.error("❌ Đổi role thất bại:", err.response?.data || err.message);
      alert("Không có quyền admin hoặc token không hợp lệ");
    }
  };

  return (
    <table className="w-full bg-white rounded shadow mt-4">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2 border">Tên</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Vai trò</th>
          <th className="p-2 border">Hành động</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="border-t">
            <td className="p-2 border">{user.name}</td>
            <td className="p-2 border">{user.email}</td>
            <td className="p-2 border">
              <select
                value={user.isAdmin ? "true" : "false"} // hiển thị từ boolean → string
                onChange={(e) => handleChangeRole(user._id, e.target.value === "true")}
                className="border rounded px-2 py-1"
              >
                <option value="false">Khách hàng</option>
                <option value="true">Admin</option>
              </select>
            </td>
            <td className="p-2 border">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(user._id)}
              >
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Users;

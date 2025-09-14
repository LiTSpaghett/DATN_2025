import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";

// Admin login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.isAdmin && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Email hoặc mật khẩu admin không đúng" });
  }
};

// Admin profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const getAllProfile = async (req, res) => {
  try{
    const users = await User.find();
    res.status(200).json(users);
  }catch(error){
    res.status(500).json({ message: error.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json({
      message: "Người dùng đã được xóa thành công",
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// Thay đổi role (isAdmin)
export const changeUserRole = async (req, res) => {
  try {
    const { id } = req.params;          
    const { isAdmin } = req.body;      

    // Tìm user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Cập nhật role
    user.isAdmin = isAdmin;
    await user.save();

    res.status(200).json({
      message: "Cập nhật quyền thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

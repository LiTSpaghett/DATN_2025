import Product from "../models/Product.js";

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy chi tiết sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {

  try {
    const { name, price, description, category, colors, stock } = req.body;

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      colors: colors ? JSON.parse(colors) : [],
      stock: stock ? JSON.parse(stock) : [],
      images: req.file ? [req.file.path] : []
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi tạo sản phẩm", error: err.message });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, colors, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        category,
        colors: colors ? JSON.parse(colors) : [],
        stock: stock ? JSON.parse(stock) : [],
        ...(req.file && { images: [req.file.path] })
      },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật sản phẩm", error: err.message });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.status(200).json({ message: "Đã xóa sản phẩm thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa sản phẩm", error: err.message });
  }
};
export const decreaseStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const { items } = req.body;

    // Kiểm tra đủ số lượng cho từng size
    for (let item of items) {
      const stockItem = product.stock.find(s => s.size === item.size);
      if (!stockItem)
        return res.status(400).json({ message: `Size ${item.size} không tồn tại` });

      if (stockItem.quantity < item.quantity)
        return res.status(400).json({ message: `Size ${item.size} chỉ còn ${stockItem.quantity} sản phẩm` });
    }

    // Giảm số lượng
    for (let item of items) {
      const stockItem = product.stock.find(s => s.size === item.size);
      stockItem.quantity -= item.quantity;
    }

    await product.save();
    res.status(200).json({ message: "Đã cập nhật số lượng thành công", product });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
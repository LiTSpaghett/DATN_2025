import Product from "../models/Product.js";
import client from "../utils/weaviateClient.js";
import { v4 as uuidv4 } from "uuid";

async function initWeaviateSchema() {
  try {
    const schemaRes = await client.schema.getter().do();
    const hasProduct = schemaRes.classes?.some(c => c.class === "Product");

    if (!hasProduct) {
      await client.schema
        .classCreator()
        .withClass({
          class: "Product",
          vectorizer: "text2vec-openai", 
          properties: [
            { name: "name", dataType: ["text"] },
            { name: "description", dataType: ["text"] },
            { name: "category", dataType: ["text"] },
            { name: "subcategory", dataType: ["text"] },
            { name: "colors", dataType: ["text"] },
            { name: "price", dataType: ["number"] },
          ],
        })
        .do();
      console.log("✅ Created Product schema in Weaviate");
    }
  } catch (err) {
    console.error("❌ Error checking/creating schema:", err.message);
  }
}

// Gọi init khi load controller
initWeaviateSchema();

// Lấy tất cả sản phẩm với tìm kiếm, lọc, phân trang
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 8 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message })
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

// convert dữ liệu sang dạng Weaviate accept
const toWeaviateProps = (product) => ({
   name: product.name,
  description: product.description || "",
  category: product.category || "",
  subcategory: product.subcategory || "",
  colors: product.colors || "",
  price: product.price,
  stock: product.stock
    ? product.stock.map((s) => `${s.size}:${s.quantity}`)
    : [],
});

// Tạo sản phẩm mới
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, colors, stock } = req.body;

    const weaviateId = uuidv4(); 

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      subcategory,
      colors,
      stock: stock ? JSON.parse(stock) : [],
      images: req.file ? [req.file.path] : [],
      weaviateId,
    });

    const savedProduct = await newProduct.save();

    //  Thêm vào Weaviate
    await client.data
      .creator()
      .withClassName("Product")
      .withId(weaviateId)
      .withProperties(toWeaviateProps(savedProduct))
      .do();

    res.status(201).json(savedProduct);
  } catch (err) {
  console.error("❌ Weaviate create error (raw):", err);

  if (err?.response) {
    console.error("📩 Weaviate error response:", JSON.stringify(err.response, null, 2));
  }

  if (err?.message) {
    console.error("📝 Error message:", err.message);
  }

  res.status(500).json({
    message: "Lỗi tạo sản phẩm",
    error: err?.message || "Unknown error",
  });
}
};

// Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category, subcategory, colors, stock } =
      req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        category,
        subcategory,
        colors,
        stock: stock ? JSON.parse(stock) : [],
        ...(req.file && { images: [req.file.path] }),
      },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    //  Đồng bộ lên Weaviate
    await client.data
      .updater()
      .withClassName("Product")
      .withId(updatedProduct.weaviateId)
      .withProperties(toWeaviateProps(updatedProduct))
      .do();

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Weaviate update error (raw):", err);
    if (err?.response?.errors) {
      console.error("Weaviate response errors:", JSON.stringify(err.response.errors, null, 2));
    }
    res.status(500).json({ 
      message: "Lỗi cập nhật sản phẩm", 
      error: err?.message || "Unknown error"
    });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    
    //  Xóa trong Weaviate
    await client.data
      .deleter()
      .withClassName("Product")
      .withId(deletedProduct.weaviateId)
      .do();

    res.status(200).json({ message: "Đã xóa sản phẩm thành công" });
  } catch (err) {
  console.error("❌ Weaviate create error (raw):", err);

  if (err?.response) {
    console.error("📩 Weaviate error response:", JSON.stringify(err.response, null, 2));
  }

  if (err?.message) {
    console.error("📝 Error message:", err.message);
  }

  res.status(500).json({
    message: "Lỗi tạo sản phẩm",
    error: err?.message || "Unknown error",
  });
}
};

// Giảm stock
export const decreaseStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    const { items } = req.body;

    for (let item of items) {
      const stockItem = product.stock.find((s) => s.size === item.size);
      if (!stockItem)
        return res
          .status(400)
          .json({ message: `Size ${item.size} không tồn tại` });

      if (stockItem.quantity < item.quantity)
        return res.status(400).json({
          message: `Size ${item.size} chỉ còn ${stockItem.quantity} sản phẩm`,
        });
    }

    // Giảm số lượng
    for (let item of items) {
      const stockItem = product.stock.find((s) => s.size === item.size);
      stockItem.quantity -= item.quantity;
    }

    await product.save();

    //  Cập nhật stock trong Weaviate
    await client.data
      .updater()
      .withClassName("Product")
      .withId(product.weaviateId)
      .withProperties(toWeaviateProps(product))
      .do();

    res
      .status(200)
      .json({ message: "Đã cập nhật số lượng thành công", product });
  } catch (err) {
    console.error("Weaviate stock error:", JSON.stringify(err, null, 2));
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy dữ liệu lọc
export const getFilters = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    const subcategories = await Product.distinct("subcategory");
    const colors = await Product.distinct("colors");

    const prices = await Product.find().select("price");
    const priceValues = prices.map((p) => p.price);
    const minPrice = priceValues.length ? Math.min(...priceValues) : 0;
    const maxPrice = priceValues.length ? Math.max(...priceValues) : 0;

    res.json({
      categories,
      subcategories,
      colors,
      priceRange: { min: minPrice, max: maxPrice },
    });
  } catch (err) {
    console.error("❌ Error in getFilters:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


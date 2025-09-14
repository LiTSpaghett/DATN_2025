import client from "../utils/weaviateClient.js";
import Product from "../models/Product.js";
import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Detect category via keyword first
async function detectCategorySubColorPrice(message) {
  try {
    // 🟢 Gọi API filters từ backend
    const { data: filters } = await axios.get("http://localhost:5000/api/products/filters");

    const { categories, subcategories, colors, minPrice, maxPrice } = filters;

    // 🟢 Build prompt động
    const prompt = `
Người dùng vừa hỏi: "${message}".

Category hợp lệ: ${categories.join(", ")}.
Subcategory hợp lệ: ${subcategories.join(", ")}.
Color hợp lệ: ${colors.join(", ")}.
Giá nằm trong khoảng từ ${minPrice} đến ${maxPrice}.

Luật:
- Luôn chọn category/subcategory nếu có từ khóa rõ ràng.
- Luôn chọn color nếu có nhắc trong câu.
- Nếu user nói "dưới X" → minPrice = null, maxPrice = X,
- Nếu user nói "trên X" → minPrice = X, maxPrice = null,
- Nếu user nói "từ X đến Y" → minPrice = X, maxPrice = Y.
- Nếu không match thì để null.

Chỉ trả về JSON đúng format:
{"category": null, "subcategory": null, "color": null, "minPrice": null, "maxPrice": null}
    `;

    // 🟢 Gọi GPT detect
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (err) {
    console.error("❌ Error detecting category/color/price:", err);
    return { category: null, subcategory: null, color: null, minPrice: null, maxPrice: null };
  }
}

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // Detect category, subcategory, color, price
    const { category, subcategory, color, minPrice, maxPrice } =
      await detectCategorySubColorPrice(message);
    console.log("🔎 Detected:", { category, subcategory, color, minPrice, maxPrice });

    // Nếu không hỏi sản phẩm → trả lời GPT bình thường
    if (!category && !subcategory && !color && !minPrice && !maxPrice) {
      const gptRes = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Bạn là chatbot hỗ trợ khách hàng." },
          { role: "user", content: message },
        ],
      });
      return res.json({ type: "chat", reply: gptRes.choices[0].message.content });
    }

    // 🔹 Chuẩn bị filter chính xác
    const operands = [];
    if (category) operands.push({ path: ["category"], operator: "Equal", valueText: category });
    if (subcategory) operands.push({ path: ["subcategory"], operator: "Equal", valueText: subcategory });
    if (color) operands.push({ path: ["colors"], operator: "Equal", valueText: color });

    let whereFilter = null;
    if (operands.length === 1) whereFilter = operands[0];
    else if (operands.length > 1) whereFilter = { operator: "And", operands };

    // 🔹 Xây query
    let query = client.graphql
      .get()
      .withClassName("Product")
      .withFields("name description category subcategory colors price _additional { id }")
      .withLimit(5);

    if (whereFilter) {
      // Nếu detect được → lọc bằng where
      query = query.withWhere(whereFilter);
    } else {
      // Nếu không detect được → fallback semantic
      query = query.withNearText({ concepts: [message] });
    }

    const weaviateRes = await query.do();
    let products = weaviateRes.data.Get.Product || [];

    // 🔹 Lọc thêm theo giá
    if (products.length > 0 && (minPrice || maxPrice)) {
      products = products.filter((p) => {
        const price = p.price || 0;
        if (minPrice && price < minPrice) return false;
        if (maxPrice && price > maxPrice) return false;
        return true;
      });
    }

    // Nếu có sản phẩm
    if (products.length > 0) {
      const weaviateIds = products.map((p) => p._additional.id);
      const mongoProducts = await Product.find({ weaviateId: { $in: weaviateIds } });
      return res.json({
        type: "products",
        category,
        subcategory,
        color,
        minPrice,
        maxPrice,
        products: mongoProducts,
      });
    }

    // 🔹 Nếu không có → fallback GPT
    const gptRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là chatbot hỗ trợ khách hàng." },
        { role: "user", content: message },
      ],
    });

    res.json({ type: "chat", reply: gptRes.choices[0].message.content });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: "Lỗi chat", error: err.message });
  }
};

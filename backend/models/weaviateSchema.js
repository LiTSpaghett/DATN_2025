import client from "../utils/weaviateClient.js";

async function createProductSchema() {
  try {
    await client.schema.classDeleter().withClassName("Product").do();

    const schemaConfig = {
      class: "Product",
      description: "E-commerce product information",
      vectorizer: "text2vec-openai",
      properties: [
        {
          name: "name",
          dataType: ["text"],
        },
        {
          name: "description",
          dataType: ["text"],
        },
        {
          name: "category",
          dataType: ["text"],
        },
        {
          name: "subcategory",
          dataType: ["text"],
        },
        {
          name: "colors",
          dataType: ["text"], 
        },
        {
          name: "price",
          dataType: ["number"],
        },
        {
          name: "stock",
          dataType: ["text[]"], 
        },
      ],
    };

    await client.schema.classCreator().withClass(schemaConfig).do();
    console.log("✅ Schema Product đã được tạo trong Weaviate!");
  } catch (err) {
    console.error("❌ Lỗi tạo schema:", err);
  }
}

createProductSchema();

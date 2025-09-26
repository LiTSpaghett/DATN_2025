import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

export default function Chatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào 👋! Bạn muốn tìm sản phẩm gì hôm nay?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
  if (!input.trim()) return;

  setMessages((prev) => [...prev, { sender: "user", text: input }]);
  setLoading(true);

  try {
    const { data } = await axios.post("http://localhost:5000/api/chat", {
      message: input,
    });

    if (data.type === "products") {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "Mình gợi ý cho bạn những sản phẩm sau:",
          products: data.products,
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    }
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "❌ Lỗi kết nối server" },
    ]);
  }

  setLoading(false);
  setInput("");
};


  return (
    <div className="fixed bottom-4 right-4 w-96 h-[550px] bg-white border rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="bg-pink-500 text-white p-3 rounded-t-lg font-bold flex justify-between items-center">
        <span>🤖 Chatbot</span>
        <button onClick={onClose} className="hover:text-gray-200">
          <X size={20} />
        </button>
      </div>

      {/* Nội dung chat */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="space-y-2">
            <div
              className={`p-2 rounded-lg max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-100 self-end text-right ml-auto"
                  : "bg-gray-100 self-start mr-auto"
              }`}
            >
              {msg.text}
            </div>

            {msg.products && msg.products.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {msg.products.map((p) => (
                  <div
                    key={p._id}
                    className="border rounded-lg p-2 flex items-center gap-3 bg-white shadow"
                  >
                    <div className="flex-1">
                      <img
                        src={`http://localhost:5000/${p.images?.[0]}`}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <h4 className="font-bold text-sm">{p.name}</h4>
                      <p className="text-xs text-gray-500">{p.colors}</p>
                      <p className="text-red-500 text-sm font-semibold">
                        {p.price.toLocaleString()} đ
                      </p>
                    </div>
                    <a
                      href={`/product/${p._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Xem
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Bot đang trả lời...</div>
        )}
      </div>

      {/* Ô nhập */}
      <div className="flex border-t p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}

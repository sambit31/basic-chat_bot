import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export default function ChatPage() {
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Setup socket
  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);

    s.on("ai-message-response", (response) => {
      const now = new Date();
      setMessages((prev) => [
        ...prev,
        {
          id: now.getTime(),
          author: "ai",
          text: response,
          time: now.toLocaleTimeString(),
        },
      ]);
    });

    return () => s.disconnect();
  }, []);

  
  const sendMessage = () => {
    const text = input.trim();
    if (!text || !socket) return;

    const now = new Date();
    const userMsg = {
      id: now.getTime(),
      author: "user",
      text,
      time: now.toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    socket.emit("ai-message", text);

    setInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-center text-xl font-semibold shadow">
        Gemini Chatbot
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] p-3 rounded-xl text-sm shadow-md ${
              msg.author === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white text-gray-800 mr-auto"
            }`}
          >
            <p className="font-semibold mb-1">
              {msg.author === "user" ? "You" : "AI"}
            </p>
            <p>{msg.text}</p>
            <p className="text-xs mt-1 opacity-70">{msg.time}</p>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 flex items-center gap-3 bg-white shadow-inner">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow text-sm"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

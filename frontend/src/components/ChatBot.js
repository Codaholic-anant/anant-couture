import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "https://anant-couture-backend.onrender.com/api";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: null,
      reply: "Hello! I'm Anaya, your personal Anant Couture assistant 👗 How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Get JWT token from localStorage
  const getToken = () => localStorage.getItem("access");

  // Load chat history on open
  useEffect(() => {
    if (isOpen && getToken()) {
      axios
        .get(`${API}/chatbot/history/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        .then((res) => {
          if (res.data.length > 0) {
            setMessages([
              {
                message: null,
                reply: "Welcome back! I'm Anaya 👗 How can I help you today?",
              },
              ...res.data,
            ]);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setLoading(true);

    // Optimistic UI
    setMessages((prev) => [
      ...prev,
      { message: userText, reply: null },
    ]);

    try {
      const res = await axios.post(
        `${API}/chatbot/`,
        { message: userText },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, reply: res.data.reply } : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, reply: "Sorry, something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-transform hover:scale-110"
        style={{ background: "linear-gradient(135deg, #1a1a1a, #8B6914)" }}
        title="Chat with Anaya"
      >
        {isOpen ? "✕" : "👗"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
          style={{ height: "460px", background: "#faf9f7" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: "linear-gradient(135deg, #1a1a1a, #8B6914)" }}
          >
            <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-lg">
              👗
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Anaya</p>
              <p className="text-amber-200 text-xs">Anant Couture Assistant</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full bg-green-400"></div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i}>
                {/* User message */}
                {m.message && (
                  <div className="flex justify-end mb-1">
                    <div
                      className="px-3 py-2 rounded-2xl rounded-tr-sm text-white text-sm max-w-[75%]"
                      style={{ background: "#1a1a1a" }}
                    >
                      {m.message}
                    </div>
                  </div>
                )}
                {/* Bot reply */}
                {m.reply && (
                  <div className="flex justify-start">
                    <div
                      className="px-3 py-2 rounded-2xl rounded-tl-sm text-sm max-w-[75%]"
                      style={{ background: "#fff", border: "1px solid #e8e0d4", color: "#1a1a1a" }}
                    >
                      {m.reply}
                    </div>
                  </div>
                )}
                {/* Loading dots */}
                {m.message && m.reply === null && loading && (
                  <div className="flex justify-start mt-1">
                    <div
                      className="px-3 py-2 rounded-2xl text-sm"
                      style={{ background: "#fff", border: "1px solid #e8e0d4" }}
                    >
                      <span className="animate-pulse">Anaya is typing...</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1">
              {["Show my orders", "New arrivals?", "Style me!"].map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  className="text-xs px-2 py-1 rounded-full border"
                  style={{ borderColor: "#8B6914", color: "#8B6914" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2 border-t"
            style={{ borderColor: "#e8e0d4" }}
          >
            <input
              type="text"
              className="flex-1 text-sm px-3 py-2 rounded-full outline-none"
              style={{ background: "#f0ece4", color: "#1a1a1a" }}
              placeholder="Ask Anaya anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-40"
              style={{ background: "#8B6914" }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
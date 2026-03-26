import { useState } from "react";
import { chatWithCoach } from "../services/api";

export default function ChatCoach({ profile }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! I'm your AaharAI coach 🌿 Ask me anything about your diet, meal swaps, or nutrition!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const reply = await chatWithCoach(newMessages, profile);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, couldn't connect. Try again!" }]);
    }
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md border border-orange-100 flex flex-col h-[500px]">
      <div className="px-5 py-4 border-b border-orange-100">
        <h3 className="font-display text-lg text-saffron">🤖 AI Coach</h3>
        <p className="text-xs text-gray-400">Ask anything about your nutrition</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
              m.role === "user" ? "bg-saffron text-white rounded-br-sm" : "bg-orange-50 text-gray-700 rounded-bl-sm"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-orange-50 px-4 py-2 rounded-2xl rounded-bl-sm">
              <span className="text-gray-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-orange-100 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about food swaps, recipes..."
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron"
        />
        <button onClick={send} className="bg-saffron text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-500">
          Send
        </button>
      </div>
    </div>
  );
}
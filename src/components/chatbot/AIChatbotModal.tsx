import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ShoppingBag,
  ExternalLink,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ChatMessage, Product } from '../../types';
import { StorageService } from '../../services/storageService';
import { GeminiService } from '../../services/geminiService';
import { useCart } from '../../context/CartContext';

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const QUICK_PROMPTS = [
  'Laptop under ₹50,000',
  'Best laptop for coding',
  'Best gaming laptop',
  'Compare two laptops',
  'Laptop for AI/ML',
  'Best student laptop',
];

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "👋 Hi! I'm **TechNova AI**, your personal laptop shopping advisor.\n\nTell me what you'll be using your laptop for (coding, gaming, AI/ML, video editing, college) or share your budget, and I'll find the perfect match from our catalog!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    StorageService.getProducts().then(setCatalog);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Fetch latest products from storage in case newly added
      const liveProducts = await StorageService.getProducts();
      const history = messages.map((m) => ({ sender: m.sender, text: m.text }));

      const response = await GeminiService.askLaptopAssistant(query, liveProducts, history);

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: response.text,
        recommendedProducts: response.recommendedProducts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: 'I encountered a brief connection issue. Please feel free to ask again or browse our Laptops catalog directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: "Conversation cleared. How can I assist with your laptop search today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* FLOATING TRIGGER BUTTON (Visible when closed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          <div className="hidden md:flex items-center bg-[#131520] border border-purple-500/30 px-3 py-1.5 rounded-full text-xs text-purple-200 shadow-xl shadow-purple-950/40 animate-bounce">
            <span>Need advice? Ask AI</span>
          </div>
          <button
            onClick={onOpen}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-2xl shadow-purple-600/50 hover:shadow-purple-500/70 hover:scale-105 active:scale-95 transition-all duration-300 border border-purple-400/30 group"
            aria-label="Open AI Laptop Shopping Assistant"
          >
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="sr-only">Open Chatbot</span>
          </button>
        </div>
      )}

      {/* CHATBOT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[460px] h-[640px] max-h-[88vh] bg-[#0d0f17] border border-purple-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-950/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* HEADER */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#141624] to-[#1d1530] border-b border-purple-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-0.5 shadow-md shadow-purple-600/30">
                <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-wide">TechNova AI</h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {GeminiService.isConfigured() ? 'Powered by Gemini 1.5' : 'Smart Laptop Advisor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* QUICK PROMPTS STRIP */}
          <div className="px-4 py-2.5 bg-[#10121d] border-b border-zinc-800/70 overflow-x-auto scrollbar-none flex gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="shrink-0 px-3 py-1 rounded-full text-xs font-medium text-purple-200 bg-purple-950/60 border border-purple-500/25 hover:bg-purple-900/60 hover:border-purple-400/50 transition duration-150 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-purple-900/50 border border-purple-500/30 flex items-center justify-center shrink-0 mt-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed ${
                        isAssistant
                          ? 'bg-[#151724] border border-zinc-800 text-zinc-200 shadow-md'
                          : 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-medium shadow-md shadow-purple-900/30 ml-auto'
                      }`}
                    >
                      {/* Message Content formatted with line breaks */}
                      <div className="whitespace-pre-wrap space-y-1">
                        {msg.text.split('\n\n').map((paragraph, pIdx) => (
                          <p key={pIdx}>{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    {/* RECOMMENDED PRODUCT CARDS (if any) */}
                    {isAssistant && msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                          Recommended TechNova Laptops:
                        </p>
                        {msg.recommendedProducts.map((p) => (
                          <div
                            key={p.id}
                            className="bg-[#12141e] border border-purple-500/25 rounded-xl p-2.5 flex items-center justify-between gap-3 hover:border-purple-500/50 transition group"
                          >
                            <img
                              src={p.colors[0]?.image || p.images[0]}
                              alt={p.name}
                              className="w-12 h-12 object-contain bg-[#181a26] rounded-lg p-1 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white truncate group-hover:text-purple-300 transition">
                                {p.name}
                              </p>
                              <p className="text-[10px] text-zinc-400 truncate">
                                {p.processor.split('(')[0]} • {p.ram}
                              </p>
                              <p className="text-xs font-bold text-purple-400 mt-0.5">
                                ₹{p.price.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  onClose();
                                  navigate(`/laptops/${p.id}`);
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg flex items-center gap-1 transition"
                              >
                                View <ExternalLink className="w-3 h-3 text-purple-400" />
                              </button>
                              <button
                                onClick={() => {
                                  addToCart(p, p.colors[0]);
                                }}
                                className="px-2.5 py-1 text-[11px] font-medium bg-purple-700 hover:bg-purple-600 text-white rounded-lg flex items-center gap-1 transition"
                              >
                                <ShoppingBag className="w-3 h-3" /> Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      className={`text-[10px] text-zinc-500 ${
                        isAssistant ? 'text-left' : 'text-right'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-zinc-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 items-center text-zinc-400 text-xs">
                <div className="w-7 h-7 rounded-lg bg-purple-900/50 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" />
                </div>
                <div className="bg-[#151724] border border-zinc-800 px-4 py-2.5 rounded-2xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                  <span>Searching TechNova database & analyzing specs...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="p-3 bg-[#11131c] border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 bg-[#181a26] border border-zinc-700/80 focus-within:border-purple-500/60 rounded-xl px-3 py-2 transition"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about budget, coding, gaming, AI/ML..."
                className="w-full bg-transparent text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white flex items-center justify-center shrink-0 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

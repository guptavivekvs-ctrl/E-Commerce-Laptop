import React from 'react';
import { Sparkles, MessageSquare, ArrowRight, Bot } from 'lucide-react';

interface AIChatbotBannerProps {
  onOpenChatbot: () => void;
}

export const AIChatbotBanner: React.FC<AIChatbotBannerProps> = ({ onOpenChatbot }) => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#171329] via-[#1f1638] to-[#121424] border border-purple-500/30 p-8 sm:p-12 shadow-2xl purple-glow">
        {/* Background ambient lighting */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-400/30 text-purple-200 text-xs font-semibold">
              <Bot className="w-4 h-4 text-purple-300" />
              <span>Intelligent Tech Advisor</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Not sure which laptop is right for you?
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Don't get bogged down in specs, clock speeds, and TGP ratings. Tell our AI assistant your workflow—software engineering, machine learning, gaming, or university coursework—and get instant personalized recommendations from our live catalog.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onOpenChatbot}
                className="purple-gradient-btn px-6 py-3.5 rounded-xl font-bold text-white text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-purple-950/60 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>Ask AI</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Zero sales pitch. 100% objective recommendations.</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-purple-900/30 border border-purple-500/30 p-6 flex flex-col items-center justify-center text-center backdrop-blur-md shadow-2xl relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center mb-3 shadow-lg shadow-purple-600/40">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <p className="text-xs font-semibold text-white">TechNova AI Engine</p>
              <p className="text-[11px] text-zinc-400 mt-1">Available 24/7 across the entire website</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

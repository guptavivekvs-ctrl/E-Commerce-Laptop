import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Zap } from 'lucide-react';

interface HeroSectionProps {
  onOpenChatbot: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenChatbot }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT COLUMN: HERO TEXT */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Next-Gen 2026 AI Laptops Now Available</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Power Your Ideas. <br />
              <span className="purple-gradient-text">Choose Your Perfect Laptop.</span>
            </h1>

            {/* Supporting paragraph */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover flagship powerhouses with Intel Core Ultra, AMD Ryzen 8000, Apple M3, and Snapdragon X Elite. Personalized matching with our intelligent AI shopping advisor.
            </p>

            {/* CTA BUTTONS */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/laptops"
                className="purple-gradient-btn px-6 py-3.5 rounded-xl font-semibold text-white text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-purple-900/50 hover:shadow-purple-700/60 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Shop Laptops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/offers"
                className="px-6 py-3.5 rounded-xl font-semibold text-zinc-200 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 hover:border-purple-500/40 text-sm sm:text-base transition duration-300"
              >
                Explore Offers
              </Link>

              <button
                onClick={onOpenChatbot}
                className="px-4 py-3.5 rounded-xl font-medium text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/20 text-sm flex items-center gap-2 transition duration-200"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Ask AI Advisor</span>
              </button>
            </div>

            {/* VALUE PROPOSITION BADGES */}
            <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Official Brand Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Local AI NPU Acceleration</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Free Express Delivery</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: HERO VISUAL CARD */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative ring */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-purple-500/30 via-purple-900/10 to-transparent shadow-2xl purple-glow">
                <div className="relative bg-[#11131e] rounded-[22px] overflow-hidden p-6 border border-purple-500/20">
                  {/* Floating badge */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-purple-900/80 border border-purple-400/40 rounded-full text-[11px] font-bold text-white shadow-lg">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    <span>Featured Flagship</span>
                  </div>

                  {/* Main Laptop Image */}
                  <div className="aspect-[4/3] relative flex items-center justify-center p-4">
                    <img
                      src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80"
                      alt="TechNova Flagship Gaming Laptop"
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Featured Card Info */}
                  <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                        HP OMEN TRANSCEND 16
                      </span>
                      <h4 className="text-sm font-semibold text-white">
                        240Hz OLED • RTX 4070 • Core i9
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Special Price: ₹1,84,990</p>
                    </div>

                    <Link
                      to="/laptops/hp-omen-transcend-16"
                      className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition shadow-md shadow-purple-900/50"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

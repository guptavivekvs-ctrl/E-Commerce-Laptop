import React from 'react';
import { Laptop, Cpu, ShieldCheck, Sparkles, Award, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* HERO BANNER */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-500 p-0.5 mx-auto mb-2 shadow-lg shadow-purple-900/50">
          <div className="w-full h-full bg-[#0a0b10] rounded-[14px] flex items-center justify-center">
            <Laptop className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
          The TechNova Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Pioneering the Next Era of Intelligent Laptop Commerce
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Founded with a simple mission: to eliminate confusion when buying high-performance laptops. We combine world-class hardware selection from HP, Apple, Dell, ASUS, Lenovo, and Microsoft with cutting-edge AI shopping advisory.
        </p>
      </div>

      {/* CORE PILLARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="p-8 rounded-3xl bg-[#11131c] border border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Curated Engineering</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Every laptop listed on TechNova undergoes hardware verification. We vet thermals, display calibration, and RAM configurations so you receive peak computing power.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#11131c] border border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">AI-First Shopping</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            No more hours spent reading conflicting Reddit threads or deciphering mobile GPU wattages. Our AI assistant analyzes your specific workflow to recommend the exact right model.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#11131c] border border-zinc-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Uncompromising Trust</h3>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            100% genuine factory sealed products with official manufacturer warranties, secure delivery, and 7-day hassle-free replacement on technical defects.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#0f111a] border border-purple-500/20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <p className="text-3xl sm:text-4xl font-black text-purple-400">50,000+</p>
          <p className="text-xs text-zinc-400 mt-1">Laptops Delivered</p>
        </div>
        <div>
          <p className="text-3xl sm:text-4xl font-black text-purple-400">99.8%</p>
          <p className="text-xs text-zinc-400 mt-1">On-Time Dispatch</p>
        </div>
        <div>
          <p className="text-3xl sm:text-4xl font-black text-purple-400">4.9 / 5</p>
          <p className="text-xs text-zinc-400 mt-1">Customer Satisfaction</p>
        </div>
        <div>
          <p className="text-3xl sm:text-4xl font-black text-purple-400">24 / 7</p>
          <p className="text-xs text-zinc-400 mt-1">AI Assistant Uptime</p>
        </div>
      </div>
    </div>
  );
};

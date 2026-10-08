import React from 'react';
import { Truck, ShieldCheck, CheckCircle2, RotateCcw, Headphones } from 'lucide-react';

export const FeaturesBanner: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      desc: 'Free express dispatch within 24-48 hours',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Checkout',
      desc: 'Encrypted payments & UPI instant verification',
    },
    {
      icon: CheckCircle2,
      title: '100% Genuine Products',
      desc: 'Sealed box with brand warranty',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      desc: '7-day replacement guarantee on defects',
    },
    {
      icon: Headphones,
      title: 'Warranty Support',
      desc: 'Authorized brand service center access',
    },
  ];

  return (
    <section className="py-10 border-y border-zinc-800/80 bg-[#0c0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60 hover:border-purple-500/30 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 group-hover:text-purple-300 transition-transform duration-200">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{f.title}</h4>
                <p className="text-xs text-zinc-400">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

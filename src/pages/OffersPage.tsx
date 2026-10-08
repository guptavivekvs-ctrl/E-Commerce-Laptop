import React, { useState, useEffect } from 'react';
import { Tag, Zap, Percent, Clock, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { StorageService } from '../services/storageService';
import { ProductCard } from '../components/common/ProductCard';

export const OffersPage: React.FC = () => {
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);

  useEffect(() => {
    StorageService.getProducts().then((all) => {
      setDiscountedProducts(all.filter((p) => p.discount > 0 || p.isOffer));
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* HEADER BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#1e1535] to-indigo-950 border border-purple-500/30 p-8 sm:p-12 mb-12 shadow-2xl purple-glow">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
            <Zap className="w-3.5 h-3.5 fill-amber-300" />
            <span>Limited-Time Season Deals</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Exclusive Laptop Offers & Discounts
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed">
            Upgrade your computing setup with unmatched discounts on flagship ultrabooks, Copilot+ PCs, and ray-tracing gaming rigs.
          </p>
        </div>

        {/* Floating Perks */}
        <div className="mt-8 pt-6 border-t border-purple-800/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-400" />
            <span>Up to 18% Off Select Flagships</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Extra ₹5,000 off on Instant UPI & HDFC/ICICI Cards</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>No-Cost EMI up to 12 months</span>
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">
            Current Discount Deals ({discountedProducts.length} Laptops)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {discountedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

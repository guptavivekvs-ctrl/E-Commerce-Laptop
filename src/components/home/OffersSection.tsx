import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, ArrowRight, Zap, Clock } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';

interface OffersSectionProps {
  products: Product[];
}

export const OffersSection: React.FC<OffersSectionProps> = ({ products }) => {
  const deals = products.filter((p) => p.discount >= 10 || p.isOffer).slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-b from-[#0a0b12] via-[#12111f] to-[#0a0b12] border-y border-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Limited Period Offers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Exclusive TechNova Discounts
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Save up to ₹35,000 on selected top-tier gaming, coding, and ultrabook laptops.
            </p>
          </div>

          <Link
            to="/offers"
            className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-900/40 hover:bg-purple-900/70 border border-purple-500/30 text-purple-200 transition"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* PROMOTIONAL BANNER */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-[#19152b] to-indigo-950/80 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Clock className="w-3.5 h-3.5" /> Weekend Blitz Deal
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Instant Bank Discount of ₹5,000 on HDFC / ICICI Cards
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
              Plus No-Cost EMI up to 12 months on all Apple, Dell XPS, and ASUS ROG series purchases.
            </p>
          </div>

          <Link
            to="/laptops"
            className="shrink-0 purple-gradient-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-900/60 z-10"
          >
            Claim Offers
          </Link>

          {/* Decorative aura */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

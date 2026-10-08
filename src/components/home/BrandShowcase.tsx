import React from 'react';
import { Link } from 'react-router-dom';
import { initialBrands } from '../../data/initialBrands';
import { ArrowRight } from 'lucide-react';

export const BrandShowcase: React.FC = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Top Tier Manufacturers
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Shop by Popular Brands
          </h2>
        </div>
        <Link
          to="/brands"
          className="mt-3 sm:mt-0 text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition"
        >
          <span>View all brands</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {initialBrands.map((brand) => (
          <Link
            key={brand.id}
            to={`/laptops?brand=${encodeURIComponent(brand.name)}`}
            className="group p-5 rounded-2xl bg-[#11131c] border border-zinc-800/80 hover:border-purple-500/40 hover:bg-[#151826] transition-all duration-300 flex flex-col items-center text-center shadow-lg hover:shadow-purple-950/30 transform hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#181a26] border border-zinc-700/60 p-2 flex items-center justify-center mb-3 group-hover:border-purple-500/50 transition">
              <img
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-cover rounded-lg filter grayscale group-hover:grayscale-0 transition duration-300"
              />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition">
              {brand.name}
            </h4>
            <span className="text-[11px] text-zinc-500 mt-0.5">Explore Laptops</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

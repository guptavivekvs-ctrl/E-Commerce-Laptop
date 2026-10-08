import React from 'react';
import { Link } from 'react-router-dom';
import { initialBrands } from '../data/initialBrands';
import { ArrowRight, Laptop } from 'lucide-react';

export const BrandsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
          Authorized Dealerships
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore World-Class Laptop Brands
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Every machine sold on TechNova comes directly from authorized factory distributors with 100% genuine brand warranty and dedicated post-purchase technical support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialBrands.map((brand) => (
          <div
            key={brand.id}
            className="p-6 rounded-3xl bg-[#11131c] border border-zinc-800/80 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/30 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-[#161826] border border-zinc-700/60 p-2.5 flex items-center justify-center shrink-0 group-hover:border-purple-500/50 transition">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                    {brand.name}
                  </h3>
                  <span className="text-xs text-purple-400 font-medium">Official Brand Store</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                {brand.description}
              </p>
            </div>

            <Link
              to={`/laptops?brand=${encodeURIComponent(brand.name)}`}
              className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-purple-900/40 text-zinc-200 hover:text-white border border-zinc-700/80 hover:border-purple-500/40 text-xs font-semibold flex items-center justify-between transition"
            >
              <span>Explore {brand.name} Models</span>
              <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

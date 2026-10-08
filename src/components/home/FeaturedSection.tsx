import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';

interface FeaturedSectionProps {
  products: Product[];
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ products }) => {
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Excellence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Featured High-Performance Laptops
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Hand-selected models offering best-in-class CPU performance, OLED displays, and battery longevity.
          </p>
        </div>

        <Link
          to="/laptops"
          className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition"
        >
          <span>View all laptops ({products.length})</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Eye, Cpu, HardDrive } from 'lucide-react';
import { Product, ProductColorVariation } from '../../types';
import { useCart } from '../../context/CartContext';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Selected color defaults to first color in product
  const [selectedColor, setSelectedColor] = useState<ProductColorVariation>(
    product.colors && product.colors.length > 0
      ? product.colors[0]
      : {
          name: 'Standard',
          hex: '#71717a',
          image: product.images[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
          stock: product.stock,
          sku: `${product.id}-STD`,
        }
  );

  const displayImage = selectedColor.image || product.images[0];
  const isOutOfStock = (selectedColor.stock ?? product.stock) <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor, 1);
    navigate('/checkout');
  };

  return (
    <div className="group relative bg-[#11131a] rounded-2xl border border-zinc-800/80 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/30 transition-all duration-300 flex flex-col overflow-hidden">
      {/* BADGES ROW */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {product.discount > 0 ? (
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40">
            {product.discount}% OFF
          </span>
        ) : product.dealTag ? (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-zinc-800/90 text-purple-300 border border-purple-500/30">
            {product.dealTag}
          </span>
        ) : (
          <span className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-zinc-900/80 text-zinc-400 border border-zinc-800">
            {product.category}
          </span>
        )}

        <span
          className={`px-2 py-0.5 text-[10px] font-semibold rounded-md border ${
            isOutOfStock
              ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
              : (selectedColor.stock ?? product.stock) <= 5
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {isOutOfStock
            ? 'Out of Stock'
            : (selectedColor.stock ?? product.stock) <= 5
            ? `Only ${selectedColor.stock} Left`
            : 'In Stock'}
        </span>
      </div>

      {/* PRODUCT IMAGE CONTAINER */}
      <Link to={`/laptops/${product.id}`} className="block relative aspect-[16/10] bg-[#161822] overflow-hidden p-6">
        <img
          src={displayImage}
          alt={`${product.name} - ${selectedColor.name}`}
          className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-transparent to-transparent opacity-60 pointer-events-none" />
      </Link>

      {/* CONTENT BODY */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-purple-400 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <RatingStars rating={product.rating} showNumber reviewCount={product.reviewCount} />
          </div>

          {/* Product Name */}
          <Link
            to={`/laptops/${product.id}`}
            className="block text-sm sm:text-base font-semibold text-white group-hover:text-purple-300 transition line-clamp-2 leading-snug mb-3"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* COLOR SWATCHES SELECTOR */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mb-3.5">
              <span className="text-[11px] text-zinc-400 mr-1">Color:</span>
              <div className="flex items-center gap-1.5">
                {product.colors.map((c) => {
                  const isSelected = selectedColor.sku === c.sku;
                  return (
                    <button
                      key={c.sku}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedColor(c);
                      }}
                      className={`w-5 h-5 rounded-full border transition-all duration-200 relative ${
                        isSelected
                          ? 'border-purple-400 scale-110 shadow-md shadow-purple-500/50'
                          : 'border-zinc-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={`${c.name} (${c.stock} in stock)`}
                    />
                  );
                })}
              </div>
              <span className="text-[11px] text-zinc-400 ml-1 truncate font-medium">
                {selectedColor.name}
              </span>
            </div>
          )}

          {/* KEY SPECS TAGS */}
          <div className="grid grid-cols-2 gap-1.5 mb-4 text-[11px] text-zinc-400">
            <div className="flex items-center gap-1 bg-[#181a24] px-2 py-1 rounded-md border border-zinc-800/80 truncate">
              <Cpu className="w-3 h-3 text-purple-400 shrink-0" />
              <span className="truncate">{product.processor.split('(')[0]}</span>
            </div>
            <div className="flex items-center gap-1 bg-[#181a24] px-2 py-1 rounded-md border border-zinc-800/80 truncate">
              <HardDrive className="w-3 h-3 text-indigo-400 shrink-0" />
              <span className="truncate">{product.ram}</span>
            </div>
          </div>
        </div>

        {/* PRICING & ACTION BUTTONS */}
        <div>
          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-zinc-500 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="col-span-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add to Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="col-span-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-900/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buy</span>
            </button>

            <Link
              to={`/laptops/${product.id}`}
              className="col-span-1 flex items-center justify-center gap-1 py-2 px-2 rounded-xl text-xs font-semibold bg-[#181a24] hover:bg-purple-950/40 text-purple-300 border border-purple-500/20 hover:border-purple-500/50 transition text-center"
              title="View Laptop Details"
            >
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>View</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

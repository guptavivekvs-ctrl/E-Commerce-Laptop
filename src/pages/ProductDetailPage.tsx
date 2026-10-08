import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Zap,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Cpu,
  HardDrive,
  Monitor,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Product, ProductColorVariation } from '../types';
import { StorageService } from '../services/storageService';
import { useCart } from '../context/CartContext';
import { RatingStars } from '../components/common/RatingStars';
import { ProductCard } from '../components/common/ProductCard';


export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ProductColorVariation | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    StorageService.getProductById(id).then(async (found) => {
      if (found) {
        setProduct(found);
        const defaultColor =
          found.colors && found.colors.length > 0
            ? found.colors[0]
            : {
                name: 'Standard',
                hex: '#71717a',
                image: found.images[0],
                stock: found.stock,
                sku: `${found.id}-STD`,
              };
        setSelectedColor(defaultColor);
        setSelectedImage(defaultColor.image || found.images[0]);
        setQuantity(1);

        // Fetch related products (same category or brand)
        const all = await StorageService.getProducts();
        const related = all
          .filter((p) => p.id !== found.id && (p.category === found.category || p.brand === found.brand))
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-400">Loading laptop details...</p>
      </div>
    );
  }

  if (!product || !selectedColor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">The laptop you are looking for does not exist or has been removed.</p>
        <Link to="/laptops" className="purple-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleColorChange = (color: ProductColorVariation) => {
    setSelectedColor(color);
    if (color.image) {
      setSelectedImage(color.image);
    }
    // If selected quantity is greater than the new color's stock, clamp it
    if (quantity > color.stock && color.stock > 0) {
      setQuantity(color.stock);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedColor) return;
    addToCart(product, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    if (!product || !selectedColor) return;
    addToCart(product, selectedColor, quantity);
    navigate('/checkout');
  };

  const availableStock = selectedColor.stock;
  const isOutOfStock = availableStock <= 0;

  // Build full gallery including product images and color variant images
  const allGalleryImages = Array.from(
    new Set([selectedImage, ...product.images, ...product.colors.map((c) => c.image)])
  ).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-purple-300 transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <Link to="/laptops" className="hover:text-purple-300 transition">
          Laptops
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <Link to={`/laptops?brand=${encodeURIComponent(product.brand)}`} className="hover:text-purple-300 transition">
          {product.brand}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
        <span className="text-zinc-200 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* TOP SECTION: GALLERY + MAIN INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
        {/* LEFT COLUMN: IMAGE GALLERY */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Visual Display */}
          <div className="relative aspect-[16/11] bg-[#12141e] border border-zinc-800 rounded-3xl p-8 flex items-center justify-center overflow-hidden shadow-2xl purple-glow-sm">
            <img
              src={selectedImage}
              alt={`${product.name} in ${selectedColor.name}`}
              className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] transition-all duration-500 transform hover:scale-105"
            />

            {/* Discount Badge */}
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg">
                Save {product.discount}%
              </div>
            )}

            {/* Current Color Watermark */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[11px] text-zinc-300 border border-zinc-700">
              Color: <span className="font-semibold text-white">{selectedColor.name}</span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {allGalleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl bg-[#161826] border p-2 shrink-0 transition ${
                  selectedImage === img
                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: PRODUCT PURCHASING & DETAILS */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider bg-purple-950/60 border border-purple-500/30 px-2.5 py-0.5 rounded-md">
                {product.brand}
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-400 font-medium">{product.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={product.rating} showNumber reviewCount={product.reviewCount} />
              <span className="text-zinc-600">|</span>
              <span className="text-xs text-zinc-400">SKU: {selectedColor.sku}</span>
            </div>
          </div>

          {/* PRICING */}
          <div className="p-4 rounded-2xl bg-[#12141e] border border-zinc-800/80">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-white tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-zinc-500 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold text-emerald-400">
                  Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discount}%)
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Inclusive of all taxes. Free express shipping included.
            </p>
          </div>

          {/* COLOR VARIATION PICKER (CRITICAL REQUIREMENT) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider">
                Select Color: <span className="text-purple-400 ml-1">{selectedColor.name}</span>
              </label>
              <span className="text-[11px] text-zinc-400">
                {availableStock > 0 ? (
                  <span className="text-emerald-400 font-medium">
                    {availableStock <= 5 ? `Only ${availableStock} left in stock!` : 'In Stock'}
                  </span>
                ) : (
                  <span className="text-rose-400 font-medium">Out of stock in this color</span>
                )}
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => {
                const isSelected = selectedColor.sku === color.sku;
                return (
                  <button
                    key={color.sku}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition ${
                      isSelected
                        ? 'bg-purple-950/70 border-purple-400 text-white shadow-md shadow-purple-950/40 ring-1 ring-purple-400/40'
                        : 'bg-[#151724] border-zinc-700/80 text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/30 shadow-inner shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span>{color.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUANTITY & ACTIONS */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center bg-[#151724] border border-zinc-700 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-1.5 text-zinc-300 hover:text-white disabled:opacity-40 transition font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                  disabled={quantity >= availableStock || isOutOfStock}
                  className="px-3 py-1.5 text-zinc-300 hover:text-white disabled:opacity-40 transition font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-zinc-500">Max {availableStock} per order</span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4 text-purple-400" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold purple-gradient-btn text-white shadow-lg shadow-purple-900/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* VALUE ASSURANCES */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-zinc-800 text-[11px] text-zinc-400 text-center">
            <div className="p-2.5 rounded-xl bg-[#12141e] border border-zinc-800 flex flex-col items-center">
              <Truck className="w-4 h-4 text-purple-400 mb-1" />
              <span>Free Delivery</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#12141e] border border-zinc-800 flex flex-col items-center">
              <Shield className="w-4 h-4 text-emerald-400 mb-1" />
              <span>Brand Warranty</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#12141e] border border-zinc-800 flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-amber-400 mb-1" />
              <span>7 Days Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED SPECIFICATIONS & DESCRIPTION TABS */}
      <div className="mb-16">
        <div className="border-b border-zinc-800 pb-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Technical Specifications & Details
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Description */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">
              About This Machine
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">{product.description}</p>

            <div className="mt-6 p-5 rounded-2xl bg-[#12141e] border border-purple-500/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>TechNova Certified Machine</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tested against stringent quality standards. Factory-sealed box including authentic high-wattage power adapter, international warranty papers, and fast-setup guide.
              </p>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="lg:col-span-7">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4">
              Hardware Architecture
            </h3>
            <div className="bg-[#12141e] rounded-2xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800/80 text-xs sm:text-sm">
              <div className="grid grid-cols-3 p-3.5 bg-zinc-900/40">
                <span className="font-semibold text-zinc-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400 shrink-0" /> Processor
                </span>
                <span className="col-span-2 text-white font-medium">{product.processor}</span>
              </div>

              <div className="grid grid-cols-3 p-3.5">
                <span className="font-semibold text-zinc-400 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-400 shrink-0" /> RAM
                </span>
                <span className="col-span-2 text-white font-medium">{product.ram}</span>
              </div>

              <div className="grid grid-cols-3 p-3.5 bg-zinc-900/40">
                <span className="font-semibold text-zinc-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400 shrink-0" /> Storage
                </span>
                <span className="col-span-2 text-white font-medium">{product.storage}</span>
              </div>

              <div className="grid grid-cols-3 p-3.5">
                <span className="font-semibold text-zinc-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400 shrink-0" /> Graphics Card
                </span>
                <span className="col-span-2 text-white font-medium">{product.graphics}</span>
              </div>

              <div className="grid grid-cols-3 p-3.5 bg-zinc-900/40">
                <span className="font-semibold text-zinc-400 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-sky-400 shrink-0" /> Display
                </span>
                <span className="col-span-2 text-white font-medium">{product.display}</span>
              </div>

              <div className="grid grid-cols-3 p-3.5">
                <span className="font-semibold text-zinc-400 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-rose-400 shrink-0" /> Operating System
                </span>
                <span className="col-span-2 text-white font-medium">{product.operatingSystem}</span>
              </div>

              <div className="grid grid-cols-3 p-3.5 bg-zinc-900/40">
                <span className="font-semibold text-zinc-400">Available Colors</span>
                <span className="col-span-2 text-white font-medium">
                  {product.colors.map((c) => c.name).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED LAPTOPS */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Similar & Related Laptops</h2>
            <Link to="/laptops" className="text-xs font-semibold text-purple-400 hover:text-purple-300">
              Browse More
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

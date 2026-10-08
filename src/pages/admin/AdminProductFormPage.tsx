import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Image as ImageIcon,
  Palette,
  Cpu,
  Layers,
  Sparkles,
  Check,
} from 'lucide-react';
import { Product, ProductColorVariation } from '../../types';
import { StorageService } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Main Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('HP');
  const [category, setCategory] = useState('Gaming');
  const [price, setPrice] = useState<number>(99990);
  const [originalPrice, setOriginalPrice] = useState<number>(119990);
  const [discount, setDiscount] = useState<number>(16);
  const [stock, setStock] = useState<number>(15);
  const [processor, setProcessor] = useState('Intel Core i7-14700HX');
  const [ram, setRAM] = useState('16GB DDR5 5600MHz');
  const [storage, setStorage] = useState('1TB PCIe Gen4 NVMe SSD');
  const [graphics, setGraphics] = useState('NVIDIA GeForce RTX 4060 8GB GDDR6');
  const [display, setDisplay] = useState('16.0" QHD+ (2560 x 1600) 165Hz IPS');
  const [operatingSystem, setOperatingSystem] = useState('Windows 11 Home');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState<number>(4.8);
  const [reviewCount, setReviewCount] = useState<number>(24);
  const [dealTag, setDealTag] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isOffer, setIsOffer] = useState(false);

  // Images List (URLs)
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // COLOR VARIATIONS (Critical requirement)
  const [colors, setColors] = useState<ProductColorVariation[]>([
    {
      name: 'Matte Black',
      hex: '#18181b',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      stock: 10,
      sku: 'TECH-BLK-001',
    },
    {
      name: 'Platinum Silver',
      hex: '#e4e4e7',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
      stock: 5,
      sku: 'TECH-SLV-002',
    },
  ]);

  useEffect(() => {
    // Load dynamic brands & categories
    StorageService.getBrands().then((b) => setBrands(b.map((x) => x.name)));
    StorageService.getCategories().then((c) => setCategories(c.map((x) => x.name)));

    if (id) {
      setLoading(true);
      StorageService.getProductById(id).then((found) => {
        if (found) {
          setName(found.name);
          setBrand(found.brand);
          setCategory(found.category);
          setPrice(found.price);
          setOriginalPrice(found.originalPrice);
          setDiscount(found.discount);
          setStock(found.stock);
          setProcessor(found.processor);
          setRAM(found.ram);
          setStorage(found.storage);
          setGraphics(found.graphics);
          setDisplay(found.display);
          setOperatingSystem(found.operatingSystem);
          setDescription(found.description);
          setRating(found.rating);
          setReviewCount(found.reviewCount);
          setDealTag(found.dealTag || '');
          setFeatured(Boolean(found.featured));
          setIsOffer(Boolean(found.isOffer));
          setImages(found.images || []);
          setColors(found.colors || []);
        }
        setLoading(false);
      });
    }
  }, [id]);

  // Recalculate discount if prices change
  const handlePriceChange = (newP: number, newOrig: number) => {
    setPrice(newP);
    setOriginalPrice(newOrig);
    if (newOrig > newP) {
      setDiscount(Math.round(((newOrig - newP) / newOrig) * 100));
    } else {
      setDiscount(0);
    }
  };

  // COLOR VARIATION ACTIONS
  const handleAddColor = () => {
    const newSku = `TECH-${brand.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    setColors((prev) => [
      ...prev,
      {
        name: 'New Color',
        hex: '#71717a',
        image: images[0] || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
        stock: 5,
        sku: newSku,
      },
    ]);
  };

  const handleUpdateColor = (index: number, field: keyof ProductColorVariation, value: any) => {
    setColors((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeleteColor = (index: number) => {
    if (colors.length <= 1) {
      showToast('A product must have at least one color variation.', 'error');
      return;
    }
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required.', 'error');
      return;
    }

    // Sum total stock from colors
    const totalVariationStock = colors.reduce((s, c) => s + (Number(c.stock) || 0), 0);
    const finalStock = Math.max(stock, totalVariationStock);

    const productPayload: Product = {
      id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name,
      brand,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discount: Number(discount),
      stock: finalStock,
      processor,
      ram,
      storage,
      graphics,
      display,
      operatingSystem,
      description,
      rating: Number(rating),
      reviewCount: Number(reviewCount),
      dealTag: dealTag.trim() || undefined,
      featured,
      isOffer,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'],
      colors,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLoading(true);
    try {
      await StorageService.saveProduct(productPayload);
      showToast(`Laptop "${name}" saved successfully!`, 'success');
      navigate('/admin/products');
    } catch (err) {
      showToast('Failed to save product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <h1 className="text-xl font-black text-white">
          {isEditing ? `Edit Laptop: ${name}` : 'Add New High-Performance Laptop'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs sm:text-sm">
        {/* BASIC INFORMATION */}
        <div className="bg-[#11131c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>Basic Product Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1">Laptop Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. HP OMEN Transcend 16 OLED"
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Brand *</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => handlePriceChange(Number(e.target.value), originalPrice)}
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Original MRP Price (₹) *
              </label>
              <input
                type="number"
                required
                value={originalPrice}
                onChange={(e) => handlePriceChange(price, Number(e.target.value))}
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Calculated Discount (%): <span className="text-emerald-400 font-bold">{discount}%</span>
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Base Total Stock Units *
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1">Deal Badge / Tag</label>
              <input
                type="text"
                value={dealTag}
                onChange={(e) => setDealTag(e.target.value)}
                placeholder="e.g. Flagship Deal, Top AI Pick, Save ₹25,000"
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-6 pt-2 sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 accent-purple-600"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300">
                <input
                  type="checkbox"
                  checked={isOffer}
                  onChange={(e) => setIsOffer(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 accent-purple-600"
                />
                <span>Include in Offers Page</span>
              </label>
            </div>
          </div>
        </div>

        {/* COLOR VARIATIONS SECTION (CRITICAL REQUIREMENT) */}
        <div className="bg-[#11131c] border border-purple-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-400" />
                <span>Color Variation Management</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Each color has its own image, stock, and SKU. Selecting this color on the customer page immediately updates the visual display and inventory!
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddColor}
              className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Color</span>
            </button>
          </div>

          <div className="space-y-4">
            {colors.map((color, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#161826] border border-zinc-700/80 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between"
              >
                {/* Visual Preview */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border border-zinc-600 shadow-md shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <img
                    src={color.image}
                    alt={color.name}
                    className="w-12 h-12 object-contain bg-[#11131c] rounded-xl p-1 border border-zinc-800 shrink-0"
                  />
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 flex-1 w-full md:w-auto">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Color Name</label>
                    <input
                      type="text"
                      required
                      value={color.name}
                      onChange={(e) => handleUpdateColor(idx, 'name', e.target.value)}
                      placeholder="e.g. Space Black"
                      className="w-full bg-[#11131c] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Hex Code</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleUpdateColor(idx, 'hex', e.target.value)}
                        className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={color.hex}
                        onChange={(e) => handleUpdateColor(idx, 'hex', e.target.value)}
                        className="w-full bg-[#11131c] border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Stock Units</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={color.stock}
                      onChange={(e) => handleUpdateColor(idx, 'stock', Number(e.target.value))}
                      className="w-full bg-[#11131c] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">Unique SKU</label>
                    <input
                      type="text"
                      required
                      value={color.sku}
                      onChange={(e) => handleUpdateColor(idx, 'sku', e.target.value)}
                      placeholder="TECH-BLK-001"
                      className="w-full bg-[#11131c] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[10px] text-zinc-400 mb-1">
                      Color-Specific Product Image URL
                    </label>
                    <input
                      type="url"
                      required
                      value={color.image}
                      onChange={(e) => handleUpdateColor(idx, 'image', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-[#11131c] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Delete Color */}
                <button
                  type="button"
                  onClick={() => handleDeleteColor(idx)}
                  className="p-2 text-rose-400 hover:text-white hover:bg-rose-950/60 rounded-xl transition"
                  title="Remove Color"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TECHNICAL SPECIFICATIONS */}
        <div className="bg-[#11131c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Hardware Specifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Processor (CPU) *</label>
              <input
                type="text"
                required
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                placeholder="e.g. Intel Core i9-14900HX or Apple M3 Pro"
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Memory (RAM) *</label>
              <input
                type="text"
                required
                value={ram}
                onChange={(e) => setRAM(e.target.value)}
                placeholder="e.g. 32GB DDR5 5600MHz"
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Storage *</label>
              <input
                type="text"
                required
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="e.g. 1TB PCIe Gen4 NVMe SSD"
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Graphics Card (GPU) *</label>
              <input
                type="text"
                required
                value={graphics}
                onChange={(e) => setGraphics(e.target.value)}
                placeholder="e.g. NVIDIA GeForce RTX 4070 8GB GDDR6"
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Display *</label>
              <input
                type="text"
                required
                value={display}
                onChange={(e) => setDisplay(e.target.value)}
                placeholder='e.g. 16.0" WQXGA 240Hz OLED'
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Operating System *</label>
              <input
                type="text"
                required
                value={operatingSystem}
                onChange={(e) => setOperatingSystem(e.target.value)}
                placeholder="e.g. Windows 11 Home / macOS"
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-zinc-300 mb-1">Product Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed highlights for shoppers and AI recommendation parsing..."
                className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="purple-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-xl shadow-purple-900/60 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Committing Changes...' : 'Save Product & Update Store'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

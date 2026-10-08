import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { Product } from '../../types';
import { StorageService, subscribeToStoreChanges } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadData = () => {
    StorageService.getProducts().then(setProducts);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStoreChanges(loadData);
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await StorageService.deleteProduct(id);
      setDeleteConfirmId(null);
      showToast('Product successfully deleted.', 'info');
    } catch (e) {
      showToast('Failed to delete product.', 'error');
    }
  };

  const filtered = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage specs, prices, stock levels, and color variations for all laptops
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="purple-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-purple-900/50 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Laptop</span>
        </Link>
      </div>

      {/* SEARCH BAR */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter products by name, brand, or category..."
          className="w-full bg-[#11131c] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* PRODUCTS TABLE */}
      <div className="bg-[#11131c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161824] text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Laptop & Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Color Variations</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((product) => {
                const totalColorStock = product.colors.reduce((s, c) => s + c.stock, 0);

                return (
                  <tr key={product.id} className="hover:bg-zinc-900/40 transition">
                    {/* Name & Thumb */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.colors[0]?.image || product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-contain bg-[#161824] p-1 rounded-xl border border-zinc-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                            {product.brand}
                          </span>
                          <p className="font-bold text-white truncate max-w-xs">{product.name}</p>
                          <p className="text-[11px] text-zinc-500 truncate max-w-xs">
                            {product.processor.split('(')[0]} • {product.ram}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-zinc-300">{product.category}</td>

                    {/* Price */}
                    <td className="p-4">
                      <span className="font-bold text-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.discount > 0 && (
                        <span className="block text-[10px] text-emerald-400">
                          {product.discount}% OFF (₹{product.originalPrice.toLocaleString('en-IN')})
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                          product.stock <= 0
                            ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                            : product.stock <= 5
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {product.stock} units ({totalColorStock} across colors)
                      </span>
                    </td>

                    {/* Colors */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {product.colors.map((c) => (
                          <span
                            key={c.sku}
                            className="w-4 h-4 rounded-full border border-zinc-700 shadow-sm"
                            style={{ backgroundColor: c.hex }}
                            title={`${c.name}: ${c.stock} in stock (${c.sku})`}
                          />
                        ))}
                        <span className="text-[11px] text-zinc-400 ml-1">
                          ({product.colors.length})
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/laptops/${product.id}`}
                          target="_blank"
                          className="p-2 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition"
                          title="View on store front"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="p-2 text-purple-400 hover:text-white bg-purple-950/50 hover:bg-purple-900 rounded-lg border border-purple-500/30 transition"
                          title="Edit Product & Colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-2 text-rose-400 hover:text-white bg-rose-950/50 hover:bg-rose-900 rounded-lg border border-rose-500/30 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM DELETE DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12141f] border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-white">Delete Laptop Product</h3>
            </div>
            <p className="text-xs text-zinc-300">
              Are you sure you want to delete this laptop from the TechNova catalog? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

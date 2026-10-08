import React, { useState, useEffect } from 'react';
import { Tags, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { Brand } from '../../types';
import { StorageService, subscribeToStoreChanges } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

export const AdminBrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({ name: '', logo: '', description: '' });
  const { showToast } = useToast();

  const loadBrands = () => {
    StorageService.getBrands().then(setBrands);
  };

  useEffect(() => {
    loadBrands();
    const unsubscribe = subscribeToStoreChanges(loadBrands);
    return () => unsubscribe();
  }, []);

  const openAdd = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      logo: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200',
      description: '',
    });
    setIsModalOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name, logo: brand.logo, description: brand.description });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await StorageService.deleteBrand(id);
      showToast('Brand deleted successfully', 'info');
    } catch (e) {
      showToast('Failed to delete brand', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const brandPayload: Brand = {
      id: editingBrand ? editingBrand.id : formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: formData.name.trim(),
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      logo: formData.logo.trim() || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=200',
      description: formData.description.trim(),
    };

    try {
      await StorageService.saveBrand(brandPayload);
      showToast(`Brand ${brandPayload.name} saved successfully`, 'success');
      setIsModalOpen(false);
    } catch (e) {
      showToast('Error saving brand', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Laptop Brand Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure partner laptop brands. Product listings and filters dynamically populate from this list.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="purple-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-purple-900/50 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Brand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl bg-[#11131c] border border-zinc-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#161826] border border-zinc-700/60 p-2 flex items-center justify-center shrink-0">
                  <img src={b.logo} alt={b.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{b.name}</h3>
                  <span className="text-[10px] text-purple-400 font-mono">Slug: {b.slug}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-3 mb-4">{b.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800/80">
              <button
                onClick={() => openEdit(b)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Edit className="w-3.5 h-3.5 text-purple-400" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDelete(b.id)}
                className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition"
                title="Delete Brand"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12141f] border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">
                {editingBrand ? `Edit Brand: ${editingBrand.name}` : 'Add New Brand'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Razer or MSI"
                  className="w-full bg-[#161826] border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Logo URL *</label>
                <input
                  type="url"
                  required
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#161826] border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Brand Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short marketing statement..."
                  className="w-full bg-[#161826] border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="purple-gradient-btn px-5 py-2 rounded-xl text-white font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Brand</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

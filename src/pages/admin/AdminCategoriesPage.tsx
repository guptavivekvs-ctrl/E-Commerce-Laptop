import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { Category } from '../../types';
import { StorageService, subscribeToStoreChanges } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', iconName: 'Laptop' });
  const { showToast } = useToast();

  const loadCategories = () => {
    StorageService.getCategories().then(setCategories);
  };

  useEffect(() => {
    loadCategories();
    const unsubscribe = subscribeToStoreChanges(loadCategories);
    return () => unsubscribe();
  }, []);

  const openAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', iconName: 'Laptop' });
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, description: cat.description, iconName: cat.iconName });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await StorageService.deleteCategory(id);
      showToast('Category deleted successfully', 'info');
    } catch (e) {
      showToast('Failed to delete category', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const catPayload: Category = {
      id: editingCategory ? editingCategory.id : formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: formData.name.trim(),
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      iconName: formData.iconName,
      description: formData.description.trim(),
    };

    try {
      await StorageService.saveCategory(catPayload);
      showToast(`Category "${catPayload.name}" saved`, 'success');
      setIsModalOpen(false);
    } catch (e) {
      showToast('Error saving category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Laptop Category Taxonomy</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Organize products into Gaming, Ultrabook, Creator, Coding/AI, Business, and Student segments.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="purple-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-purple-900/50 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-[#11131c] border border-zinc-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <FolderTree className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{c.name}</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">slug: {c.slug}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 line-clamp-3 mb-4">{c.description}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                onClick={() => openEdit(c)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Edit className="w-3.5 h-3.5 text-purple-400" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDelete(c.id)}
                className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition"
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
                {editingCategory ? `Edit: ${editingCategory.name}` : 'New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Workstation or 2-in-1 Touch"
                  className="w-full bg-[#161826] border border-zinc-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short explanation of who this category targets..."
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
                  <span>Save Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

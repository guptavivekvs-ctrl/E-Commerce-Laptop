import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Laptop, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { StorageService } from '../../services/storageService';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChatbot: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onOpenChatbot,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    StorageService.getProducts().then(setProducts);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = searchTerm.trim()
    ? products.filter((p) => {
        const query = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.processor.toLowerCase().includes(query) ||
          p.ram.toLowerCase().includes(query) ||
          p.storage.toLowerCase().includes(query) ||
          p.graphics.toLowerCase().includes(query)
        );
      })
    : [];

  const handleSelectProduct = (id: string) => {
    onClose();
    navigate(`/laptops/${id}`);
  };

  const quickKeywords = ['MacBook', 'OMEN', 'RTX 4070', 'OLED', '16GB RAM', 'Gaming', 'Copilot+'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#11131c] rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* INPUT BAR */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-800 bg-[#161824]">
          <Search className="w-5 h-5 text-purple-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by laptop name, brand, processor, RAM, or graphics..."
            className="w-full bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-zinc-400 hover:text-white rounded-md mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs text-zinc-400 hover:text-white bg-zinc-800 rounded-lg"
          >
            Esc
          </button>
        </div>

        {/* QUICK SUGGESTION TAGS */}
        {!searchTerm && (
          <div className="p-4 border-b border-zinc-800/60 bg-[#0e1017]">
            <p className="text-xs text-zinc-400 mb-2 font-medium">Popular searches:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickKeywords.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-2.5 py-1 text-xs bg-zinc-800/80 hover:bg-purple-900/40 hover:text-purple-300 text-zinc-300 rounded-lg border border-zinc-700/60 transition"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS AREA */}
        <div className="overflow-y-auto p-4 flex-1 space-y-2">
          {searchTerm.trim() ? (
            filtered.length > 0 ? (
              filtered.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-purple-950/30 border border-zinc-800 hover:border-purple-500/40 cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.colors[0]?.image || product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-contain bg-[#161824] rounded-lg p-1 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                          {product.brand}
                        </span>
                        <span className="text-[10px] text-zinc-500">•</span>
                        <span className="text-[10px] text-zinc-400">{product.category}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {product.processor} | {product.ram} | {product.graphics}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-3">
                    <p className="text-sm font-bold text-white">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] text-purple-400 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                      Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 px-4">
                <Laptop className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-white mb-1">
                  No laptops matching "{searchTerm}"
                </p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
                  Try searching by brand (Apple, HP, Dell, ASUS), CPU (i7, Ryzen), or category (Gaming, Student).
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenChatbot();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Ask AI Shopping Assistant
                </button>
              </div>
            )
          ) : (
            <div className="text-center py-8 text-zinc-500 text-xs">
              Type keywords above to search all laptops in real-time.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#0c0d13] border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span>Search TechNova database</span>
          <button
            onClick={() => {
              onClose();
              navigate(`/laptops?search=${encodeURIComponent(searchTerm)}`);
            }}
            className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
          >
            View all matching in Shop <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

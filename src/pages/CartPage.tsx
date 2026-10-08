import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const {
    items,
    totalItems,
    subtotal,
    deliveryFee,
    discountTotal,
    finalTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-purple-950/40 border border-purple-500/20 rounded-3xl flex items-center justify-center text-purple-400 mx-auto mb-6 shadow-xl">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-white mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto mb-8">
          Explore our next-generation laptops with OLED displays and dedicated AI neural power.
        </p>
        <Link
          to="/laptops"
          className="purple-gradient-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-900/50 inline-flex items-center gap-2"
        >
          <span>Explore Laptops Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Review {totalItems} item{totalItems > 1 ? 's' : ''} in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-400 hover:text-rose-300 transition flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* CART ITEMS LIST */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const itemSubtotal = item.product.price * item.quantity;
            const maxStock = item.selectedColor.stock;

            return (
              <div
                key={`${item.productId}-${item.selectedColor.sku}`}
                className="p-5 rounded-2xl bg-[#11131c] border border-zinc-800/80 hover:border-purple-500/30 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Thumbnail & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 rounded-xl bg-[#161824] p-2 border border-zinc-800 shrink-0 flex items-center justify-center">
                    <img
                      src={item.selectedColor.image || item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                        {item.product.brand}
                      </span>
                      <span className="text-xs text-zinc-600">•</span>
                      <span className="text-xs text-zinc-400">{item.product.category}</span>
                    </div>

                    <Link
                      to={`/laptops/${item.productId}`}
                      className="text-sm font-bold text-white hover:text-purple-300 transition line-clamp-1"
                    >
                      {item.product.name}
                    </Link>

                    {/* Color badge */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-zinc-400">Color:</span>
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-zinc-700 shadow-sm"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span className="text-xs font-medium text-zinc-200">
                        {item.selectedColor.name}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        ({item.selectedColor.sku})
                      </span>
                    </div>

                    <p className="text-xs text-purple-400 font-bold mt-2 sm:hidden">
                      ₹{item.product.price.toLocaleString('en-IN')} each
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center bg-[#181a26] border border-zinc-700 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedColor.sku, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="p-1.5 text-zinc-300 hover:text-white disabled:opacity-30 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedColor.sku, item.quantity + 1)
                        }
                        disabled={item.quantity >= maxStock}
                        className="p-1.5 text-zinc-300 hover:text-white disabled:opacity-30 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-zinc-500">Stock: {maxStock}</span>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-base font-extrabold text-white">
                      ₹{itemSubtotal.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-zinc-500 hidden sm:block">
                      ₹{item.product.price.toLocaleString('en-IN')} each
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.productId, item.selectedColor.sku)}
                    className="p-2 text-zinc-500 hover:text-rose-400 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <div className="lg:col-span-4 bg-[#11131c] border border-zinc-800/90 rounded-2xl p-6 sticky top-28 shadow-xl space-y-6">
          <h3 className="text-lg font-bold text-white pb-3 border-b border-zinc-800">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-400">Items Subtotal ({totalItems})</span>
              <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Product Savings</span>
                <span className="font-semibold">-₹{discountTotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-zinc-400">Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="font-bold text-emerald-400 uppercase text-xs">FREE</span>
              ) : (
                <span className="font-semibold text-white">₹{deliveryFee.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
              <span className="text-base font-bold text-white">Total Amount</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full purple-gradient-btn py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xl shadow-purple-900/60 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition duration-200"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-4 border-t border-zinc-800 text-[11px] text-zinc-400 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Safe and encrypted checkout processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Free shipping applied on orders above ₹50,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

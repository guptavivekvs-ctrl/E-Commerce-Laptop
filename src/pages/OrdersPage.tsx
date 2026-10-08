import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Eye, ShoppingBag, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { StorageService, subscribeToStoreChanges } from '../services/storageService';

const STATUS_COLORS: Record<OrderStatus, string> = {
  'Order Placed': 'bg-blue-950/80 text-blue-300 border-blue-500/40',
  'Processing': 'bg-purple-950/80 text-purple-300 border-purple-500/40',
  'Shipped': 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
  'Out for Delivery': 'bg-amber-950/80 text-amber-300 border-amber-500/40',
  'Delivered': 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
  'Cancelled': 'bg-rose-950/80 text-rose-300 border-rose-500/40',
};

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (user) {
      const userOrders = await StorageService.getUserOrders(user.id);
      setOrders(userOrders);
    } else {
      // In guest or non-logged mode, load recent orders from local storage
      const all = await StorageService.getOrders();
      setOrders(all);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const unsubscribe = subscribeToStoreChanges(fetchOrders);
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-400">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track shipment status, warranties, and previous purchases
          </p>
        </div>

        <Link to="/laptops" className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold">
          <span>Shop More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#11131c] border border-zinc-800 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <Package className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Orders Found</h3>
          <p className="text-xs sm:text-sm text-zinc-400 mb-6">
            You haven't placed any laptop orders yet. Start exploring our high-performance lineup!
          </p>
          <Link
            to="/laptops"
            className="purple-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-purple-900/50 inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Browse Laptops</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#11131c] border border-zinc-800/80 hover:border-purple-500/30 rounded-2xl p-6 transition shadow-lg"
            >
              {/* ORDER HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800 text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-zinc-500 block text-[10px]">ORDER ID</span>
                    <span className="font-mono font-bold text-white text-sm">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">PLACED ON</span>
                    <span className="text-zinc-300 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px]">TOTAL AMOUNT</span>
                    <span className="font-bold text-purple-400">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      STATUS_COLORS[order.orderStatus] || 'bg-zinc-800 text-zinc-300 border-zinc-700'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  <Link
                    to={`/orders/${order.id}`}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>

              {/* PRODUCTS LIST */}
              <div className="pt-4 divide-y divide-zinc-800/60">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-14 h-14 object-contain bg-[#161824] p-1 rounded-xl border border-zinc-800 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                          {item.brand}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">
                          {item.productName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-zinc-700"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span>{item.colorName}</span>
                          </span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] text-zinc-500">{item.colorSku}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-white">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </p>
                      <Link
                        to={`/laptops/${item.productId}`}
                        className="text-[11px] text-purple-400 hover:text-purple-300"
                      >
                        Buy Again
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

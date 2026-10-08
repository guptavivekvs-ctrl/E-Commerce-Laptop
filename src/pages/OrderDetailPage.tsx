import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Check,
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { StorageService, subscribeToStoreChanges } from '../services/storageService';

const TRACKING_STEPS: OrderStatus[] = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
];

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = () => {
    if (!id) return;
    StorageService.getOrderById(id).then((found) => {
      setOrder(found);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrder();
    const unsubscribe = subscribeToStoreChanges(fetchOrder);
    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-400">Loading order info...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">Could not locate order #{id}</p>
        <Link to="/orders" className="purple-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = TRACKING_STEPS.indexOf(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-800 mb-8">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>

        <span className="text-xs text-purple-400 font-mono font-bold">#{order.id}</span>
      </div>

      {/* TRACKING PROGRESS BAR (Only if not cancelled) */}
      {order.orderStatus === 'Cancelled' ? (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs mb-8 flex items-center gap-3">
          <Clock className="w-5 h-5 text-rose-400 shrink-0" />
          <span>This order was cancelled. Any authorized demo payment has been voided.</span>
        </div>
      ) : (
        <div className="bg-[#11131c] border border-zinc-800 rounded-3xl p-6 mb-8 shadow-xl">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-6">
            Live Shipment Journey
          </h3>
          <div className="relative flex items-center justify-between">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-800 -translate-y-1/2 z-0" />
            {/* Active filled line */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-purple-500 -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width: `${Math.max(0, (currentStepIndex / (TRACKING_STEPS.length - 1)) * 100)}%`,
              }}
            />

            {TRACKING_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCurrent
                        ? 'bg-purple-600 text-white ring-4 ring-purple-600/30'
                        : isCompleted
                        ? 'bg-purple-900 text-purple-200 border border-purple-500'
                        : 'bg-[#181a26] text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-2 font-medium text-center hidden sm:block ${
                      isCurrent ? 'text-purple-300 font-bold' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ORDER DETAILS BOX */}
      <div className="bg-[#11131c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* TOP SUMMARY */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span>Method: {order.paymentMethod} ({order.paymentStatus})</span>
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-500/40">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* ITEMS */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-400" />
            <span>Items Ordered</span>
          </h3>

          <div className="divide-y divide-zinc-800/80">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.productName} className="w-16 h-16 object-contain bg-[#161824] p-1 rounded-xl border border-zinc-800 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      {item.brand}
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.productName}</h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-zinc-700" style={{ backgroundColor: item.colorHex }} />
                        <span>{item.colorName}</span>
                      </span>
                      <span>•</span>
                      <span>Quantity: {item.quantity}</span>
                      <span>•</span>
                      <span className="font-mono text-zinc-500">{item.colorSku}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    ₹{item.subtotal.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADDRESS & TOTALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800 text-xs">
          <div className="p-4 rounded-xl bg-[#161824] border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Shipping Destination</span>
            </div>
            <p className="font-semibold text-white">{order.customer.name}</p>
            <p className="text-zinc-400">{order.deliveryAddress.street}</p>
            <p className="text-zinc-400">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </p>
            <p className="text-zinc-500 pt-1">Phone: {order.customer.mobile}</p>
          </div>

          <div className="p-4 rounded-xl bg-[#161824] border border-zinc-800 space-y-2">
            <div className="flex justify-between text-zinc-400">
              <span>Subtotal:</span>
              <span className="text-white font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount:</span>
                <span>-₹{order.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-400">
              <span>Delivery Fee:</span>
              <span className="text-emerald-400 uppercase font-semibold">
                {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-700/60 flex justify-between text-sm font-bold text-white">
              <span>Total Paid:</span>
              <span className="text-purple-400 text-base">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

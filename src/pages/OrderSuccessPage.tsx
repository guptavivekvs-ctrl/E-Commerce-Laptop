import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  ShoppingBag,
  Calendar,
  CreditCard,
  MapPin,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { Order } from '../types';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#6366f1', '#ec4899', '#ffffff'],
    });

    if (id) {
      StorageService.getOrderById(id).then((found) => {
        setOrder(found);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-zinc-400">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">Could not find record for order #{id}</p>
        <Link to="/orders" className="purple-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* SUCCESS HERO HEADER */}
      <div className="text-center mb-10 space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Thank You! Your Order is Confirmed
        </h1>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          We've received your order and our fulfillment team is preparing your laptop for dispatch.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-mono text-purple-300">
          Order ID: <span className="font-bold text-white">{order.id}</span>
        </div>
      </div>

      {/* ORDER SUMMARY CARD */}
      <div className="bg-[#11131c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
        {/* TOP STATUS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-800 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Order Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span>Payment: {order.paymentMethod} ({order.paymentStatus})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Status:</span>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* ORDER ITEMS LIST */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-purple-400" />
            <span>Purchased Laptops</span>
          </h3>

          <div className="divide-y divide-zinc-800/80">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#161824] p-1.5 border border-zinc-800 shrink-0 flex items-center justify-center">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      {item.brand}
                    </span>
                    <h4 className="text-sm font-bold text-white">{item.productName}</h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-zinc-700" style={{ backgroundColor: item.colorHex }} />
                        <span>{item.colorName}</span>
                      </span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-zinc-500">{item.colorSku}</span>
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

        {/* ADDRESS & SUMMARY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-800 text-xs">
          {/* Shipping Address */}
          <div className="p-4 rounded-xl bg-[#161824] border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 font-semibold">
              <MapPin className="w-4 h-4" />
              <span>Delivery Address</span>
            </div>
            <p className="font-semibold text-white">{order.customer.name}</p>
            <p className="text-zinc-400">{order.deliveryAddress.street}</p>
            <p className="text-zinc-400">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </p>
            <p className="text-zinc-500 pt-1">Mobile: {order.customer.mobile}</p>
          </div>

          {/* Pricing Breakdown */}
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
              <span>Delivery Charges:</span>
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

        {/* ACTION BUTTONS */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/orders"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-center transition flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4 text-purple-400" />
            <span>View My Orders</span>
          </Link>

          <Link
            to="/laptops"
            className="w-full sm:w-auto purple-gradient-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xl shadow-purple-900/60 text-center transition flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

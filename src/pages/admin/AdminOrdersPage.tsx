import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
  CreditCard,
  MapPin,
  X,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { StorageService, subscribeToStoreChanges } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

const ALL_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  'Order Placed': 'bg-blue-950/80 text-blue-300 border-blue-500/40',
  'Processing': 'bg-purple-950/80 text-purple-300 border-purple-500/40',
  'Shipped': 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
  'Out for Delivery': 'bg-amber-950/80 text-amber-300 border-amber-500/40',
  'Delivered': 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
  'Cancelled': 'bg-rose-950/80 text-rose-300 border-rose-500/40',
};

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { showToast } = useToast();

  const loadOrders = () => {
    StorageService.getOrders().then(setOrders);
  };

  useEffect(() => {
    loadOrders();
    const unsubscribe = subscribeToStoreChanges(loadOrders);
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await StorageService.updateOrderStatus(orderId, newStatus);
      showToast(`Order #${orderId} status updated to "${newStatus}"`, 'success');
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
      }
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const filtered = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.email.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Customer Order Fulfillment</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review orders, inspect selected color variations, and update fulfillment tracking
          </p>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#11131c] border border-zinc-800 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order ID, customer name, email..."
            className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#161826] border border-zinc-700 rounded-xl px-3 py-1.5 text-zinc-200 focus:outline-none"
          >
            <option value="All">All Statuses ({orders.length})</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-[#11131c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161824] text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Laptops Ordered</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-900/40 transition">
                  <td className="p-4">
                    <span className="font-mono font-bold text-white block">#{order.id}</span>
                    <span className="text-[11px] text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </td>

                  <td className="p-4">
                    <p className="font-bold text-white">{order.customer.name}</p>
                    <p className="text-[11px] text-zinc-400">{order.customer.email}</p>
                    <p className="text-[10px] text-zinc-500">{order.customer.mobile}</p>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      {order.items.map((it, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-zinc-300">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-zinc-700"
                            style={{ backgroundColor: it.colorHex }}
                          />
                          <span className="truncate max-w-[180px] font-medium">{it.productName}</span>
                          <span className="text-zinc-500 text-[11px]">({it.colorName} × {it.quantity})</span>
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-purple-400 text-sm">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-zinc-500">
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </td>

                  <td className="p-4">
                    {/* Status Select with direct DB sync */}
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                        STATUS_COLORS[order.orderStatus]
                      }`}
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st} className="bg-[#12141e] text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INSPECT ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#12141f] border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-purple-400" />
                  <span>Order Inspection: #{selectedOrder.id}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STATUS UPDATE ROW */}
            <div className="p-4 rounded-2xl bg-[#161826] border border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300">Update Tracking Journey:</span>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                  STATUS_COLORS[selectedOrder.orderStatus]
                }`}
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st} className="bg-[#12141e] text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* CUSTOMER & DESTINATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#161826] border border-zinc-800 space-y-1">
                <span className="text-purple-400 font-semibold uppercase text-[10px] block">
                  Customer
                </span>
                <p className="font-bold text-white">{selectedOrder.customer.name}</p>
                <p className="text-zinc-400">{selectedOrder.customer.email}</p>
                <p className="text-zinc-500">Phone: {selectedOrder.customer.mobile}</p>
              </div>

              <div className="p-4 rounded-xl bg-[#161826] border border-zinc-800 space-y-1">
                <span className="text-purple-400 font-semibold uppercase text-[10px] block">
                  Shipping Address
                </span>
                <p className="text-zinc-300">{selectedOrder.deliveryAddress.street}</p>
                <p className="text-zinc-300">
                  {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} -{' '}
                  {selectedOrder.deliveryAddress.pincode}
                </p>
              </div>
            </div>

            {/* ORDERED ITEMS WITH COLOR BREAKDOWN */}
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                Items & Color Configurations
              </h4>
              <div className="divide-y divide-zinc-800/80">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 object-contain bg-[#181a26] p-1 rounded-xl border border-zinc-800 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white">{item.productName}</p>
                        <div className="flex items-center gap-2 text-zinc-400 text-[11px] mt-0.5">
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-zinc-700"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span>{item.colorName}</span>
                          </span>
                          <span>•</span>
                          <span>SKU: {item.colorSku}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-white">₹{item.subtotal.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTALS */}
            <div className="pt-4 border-t border-zinc-800 flex justify-between items-baseline text-xs">
              <span className="text-zinc-400">Total Charged:</span>
              <span className="text-lg font-black text-purple-400">
                ₹{selectedOrder.total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

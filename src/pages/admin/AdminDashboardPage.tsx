import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Users,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Product, Order, UserProfile } from '../../types';
import { StorageService, subscribeToStoreChanges } from '../../services/storageService';

export const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [prods, ords, usrs] = await Promise.all([
      StorageService.getProducts(),
      StorageService.getOrders(),
      StorageService.getUsers(),
    ]);
    setProducts(prods);
    setOrders(ords);
    setUsers(usrs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStoreChanges(loadData);
    return () => unsubscribe();
  }, []);

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-zinc-400">Loading dashboard telemetry...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${totalSales.toLocaleString('en-IN')}`,
      change: '+18.4% from last month',
      icon: IndianRupee,
      color: 'from-emerald-600/20 to-teal-900/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      change: `${orders.filter((o) => o.orderStatus === 'Order Placed').length} pending dispatch`,
      icon: ShoppingBag,
      color: 'from-purple-600/20 to-indigo-900/10 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Active Products',
      value: products.length.toString(),
      change: 'Across 7 flagship brands',
      icon: Laptop,
      color: 'from-blue-600/20 to-indigo-900/10 text-blue-400 border-blue-500/30',
    },
    {
      title: 'Registered Users',
      value: users.length.toString(),
      change: 'Customers & administrators',
      icon: Users,
      color: 'from-violet-600/20 to-fuchsia-900/10 text-violet-400 border-violet-500/30',
    },
    {
      title: 'Low Stock Alert',
      value: lowStockProducts.length.toString(),
      change: '≤ 5 units remaining',
      icon: AlertTriangle,
      color: 'from-amber-600/20 to-yellow-900/10 text-amber-400 border-amber-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time sales analytics, catalog stock monitoring, and order fulfillments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products/add"
            className="purple-gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-purple-900/50 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Laptop</span>
          </Link>
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-2xl bg-gradient-to-b bg-[#11131c] border ${card.color} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-400">{card.title}</span>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">{card.value}</p>
                <p className="text-[11px] text-zinc-400 mt-1">{card.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT ORDERS & LOW STOCK PRODUCTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-7 bg-[#11131c] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Recent Customer Orders</span>
            </h3>
            <Link to="/admin/orders" className="text-xs text-purple-400 hover:text-purple-300">
              View All ({orders.length})
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">No orders recorded yet.</p>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">#{order.id}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-300">{order.customer.name}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {order.items.length} item(s) • {order.paymentMethod}
                    </p>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-bold text-white">₹{order.total.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] text-purple-400 font-semibold">{order.orderStatus}</span>
                    </div>
                    <Link
                      to="/admin/orders"
                      className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LOW STOCK PRODUCTS WARNING */}
        <div className="lg:col-span-5 bg-[#11131c] border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Low Inventory Watchlist</span>
            </h3>
            <Link to="/admin/products" className="text-xs text-purple-400 hover:text-purple-300">
              Manage Stock
            </Link>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-400 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8" />
              <span>All laptops have healthy inventory levels (&gt; 5 units).</span>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.colors[0]?.image || p.images[0]}
                      alt={p.name}
                      className="w-10 h-10 object-contain bg-[#161824] rounded-lg p-1 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{p.name}</p>
                      <p className="text-[11px] text-zinc-500">{p.brand} • {p.colors.length} variations</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                      {p.stock} units left
                    </span>
                    <Link
                      to={`/admin/products/edit/${p.id}`}
                      className="block text-[11px] text-purple-400 hover:text-purple-300 mt-1"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

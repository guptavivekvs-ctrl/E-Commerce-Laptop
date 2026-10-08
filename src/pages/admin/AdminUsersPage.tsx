import React, { useState, useEffect } from 'react';
import { Users, Search, ShieldCheck, User, Calendar, MapPin, Eye, X } from 'lucide-react';
import { UserProfile, Order } from '../../types';
import { StorageService, subscribeToStoreChanges } from '../../services/storageService';
import { useToast } from '../../context/ToastContext';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const { showToast } = useToast();

  const loadData = async () => {
    const [usrs, ords] = await Promise.all([
      StorageService.getUsers(),
      StorageService.getOrders(),
    ]);
    setUsers(usrs);
    setOrders(ords);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStoreChanges(loadData);
    return () => unsubscribe();
  }, []);

  const handleToggleRole = async (user: UserProfile) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    try {
      await StorageService.saveUser({ ...user, role: newRole });
      showToast(`User ${user.name} role changed to ${newRole}`, 'success');
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (e) {
      showToast('Failed to update role', 'error');
    }
  };

  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.mobile.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Registered User Accounts</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage authenticated customers, role privileges, and purchase histories
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or mobile..."
          className="w-full bg-[#11131c] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* USERS TABLE */}
      <div className="bg-[#11131c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#161824] text-zinc-400 border-b border-zinc-800 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Customer Name & Contact</th>
                <th className="p-4">Account Role</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Member Since</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((user) => {
                const userOrders = orders.filter((o) => o.userId === user.id);

                return (
                  <tr key={user.id} className="hover:bg-zinc-900/40 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-900/40 border border-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-xs uppercase shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="text-[11px] text-zinc-400">{user.email}</p>
                          <p className="text-[10px] text-zinc-500">{user.mobile || 'No phone'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          user.role === 'admin'
                            ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                        ) : (
                          <User className="w-3.5 h-3.5" />
                        )}
                        <span className="capitalize">{user.role}</span>
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-white">{userOrders.length} order(s)</span>
                    </td>

                    <td className="p-4 text-zinc-400">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 transition mr-2"
                      >
                        <Eye className="w-3.5 h-3.5 text-purple-400" />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => handleToggleRole(user)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          user.role === 'admin'
                            ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
                            : 'bg-purple-950/60 hover:bg-purple-900 text-purple-200 border-purple-500/30'
                        }`}
                      >
                        {user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12141f] border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">Customer Profile Overview</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-500/20 text-purple-300 font-bold flex items-center justify-center text-lg uppercase">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedUser.name}</h4>
                  <p className="text-zinc-400">{selectedUser.email}</p>
                  <p className="text-zinc-500">{selectedUser.mobile}</p>
                </div>
              </div>

              {selectedUser.address && (
                <div className="p-3.5 rounded-xl bg-[#161826] border border-zinc-800 space-y-1">
                  <span className="font-bold text-purple-400 uppercase text-[10px] block">
                    Registered Delivery Address
                  </span>
                  <p className="text-zinc-300">{selectedUser.address.street || 'No street specified'}</p>
                  <p className="text-zinc-400">
                    {selectedUser.address.city} {selectedUser.address.state} {selectedUser.address.pincode}
                  </p>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-[#161826] border border-zinc-800">
                <span className="font-bold text-purple-400 uppercase text-[10px] block mb-1">
                  Lifetime Orders
                </span>
                <p className="text-white font-medium">
                  {orders.filter((o) => o.userId === selectedUser.id).length} order(s) placed
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-white hover:bg-zinc-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

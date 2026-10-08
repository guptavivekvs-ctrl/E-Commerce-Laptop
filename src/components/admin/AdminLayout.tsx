import React from 'react';
import { Outlet, Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminSidebar } from './AdminSidebar';
import { ShieldCheck, User } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Protected route checking: must be logged in as admin role
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN ADMIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* TOP BAR */}
        <header className="h-16 bg-[#0c0d14] border-b border-zinc-800/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>TechNova Core Management Engine</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 text-xs text-zinc-300">
              <div className="w-7 h-7 rounded-lg bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-200 font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block font-semibold text-white leading-tight">{user.name}</span>
                <span className="text-[10px] text-purple-400">System Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* OUTLET VIEW */}
        <main className="p-6 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Laptop,
  ShoppingBag,
  Users,
  Tags,
  FolderTree,
  Settings,
  LogOut,
  ChevronLeft,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Laptop },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Brands', path: '/admin/brands', icon: Tags },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'API & Config', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0d0e17] border-r border-zinc-800 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-zinc-800">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-wide block leading-none">
                TECH<span className="text-purple-400">NOVA</span>
              </span>
              <span className="text-[10px] text-purple-300 font-semibold uppercase tracking-wider">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-purple-900/50 text-white border border-purple-500/40 shadow-inner'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-purple-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-zinc-800 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900/60 hover:bg-zinc-800/60 border border-zinc-800 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            <span>Store Front</span>
          </span>
          <span className="text-[10px] text-zinc-500">Live</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit Admin Session</span>
        </button>
      </div>
    </aside>
  );
};

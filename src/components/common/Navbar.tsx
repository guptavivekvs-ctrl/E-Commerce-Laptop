import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Laptop,
  Search,
  ShoppingCart,
  User,
  Sparkles,
  Menu,
  X,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenChatbot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenChatbot }) => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Laptops', path: '/laptops' },
    { label: 'Brands', path: '/brands' },
    { label: 'Offers', path: '/offers' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0b10]/85 backdrop-blur-md border-b border-purple-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-violet-400 p-0.5 shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition duration-300">
              <div className="w-full h-full bg-[#0a0b10] rounded-[10px] flex items-center justify-center">
                <Laptop className="w-5 h-5 text-purple-400 group-hover:scale-110 transition duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-purple-300 transition flex items-center gap-1">
                TECH<span className="text-purple-400">NOVA</span>
              </span>
              <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-medium -mt-1">
                Laptops & AI
              </span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? 'text-white bg-purple-950/60 border border-purple-500/30 shadow-inner'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* SEARCH BUTTON */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-xl transition duration-200"
              title="Search laptops (Ctrl+K)"
              aria-label="Search laptops"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* AI CHATBOT TRIGGER */}
            <button
              onClick={onOpenChatbot}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-purple-200 bg-purple-900/30 border border-purple-500/30 hover:bg-purple-800/40 hover:border-purple-400/60 shadow-lg shadow-purple-950/50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>AI Chatbot</span>
            </button>

            {/* CART BUTTON */}
            <Link
              to="/cart"
              className="relative p-2.5 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-xl transition duration-200"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full border border-[#0a0b10] shadow-md shadow-purple-600/40 animate-in zoom-in">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* USER / PROFILE MENU */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-700/60 hover:border-purple-500/40 text-xs sm:text-sm text-zinc-200 transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-violet-400 flex items-center justify-center text-white font-bold text-xs uppercase shadow">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden md:inline font-medium text-xs max-w-[90px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  {/* PROFILE DROPDOWN */}
                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-[#12141e] border border-purple-500/20 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-zinc-800">
                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-900/60 text-purple-300 border border-purple-500/40">
                            Administrator
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-purple-300 hover:bg-purple-900/30 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-400" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800/60 transition"
                      >
                        <User className="w-4 h-4 text-zinc-400" />
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800/60 transition"
                      >
                        <Package className="w-4 h-4 text-zinc-400" />
                        My Orders
                      </Link>

                      <div className="border-t border-zinc-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 transition text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-zinc-800/80 border border-zinc-700/60 hover:bg-zinc-700/80 hover:border-purple-500/30 transition duration-200"
                  >
                    <User className="w-4 h-4 text-purple-400" />
                    <span>Login</span>
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0d14] border-b border-purple-500/20 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-purple-900/40 text-purple-300 font-semibold border border-purple-500/30'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChatbot();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-white bg-purple-700 hover:bg-purple-600 shadow-md shadow-purple-900/40"
            >
              <Sparkles className="w-4 h-4" />
              Ask AI Laptop Assistant
            </button>

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-purple-400 bg-purple-950/30 rounded-lg border border-purple-500/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-zinc-300 hover:text-white"
                >
                  My Profile ({user.name})
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm text-zinc-300 hover:text-white"
                >
                  My Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-3 py-2 text-sm text-rose-400"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-medium bg-zinc-800 text-white rounded-xl"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-medium bg-purple-600 text-white rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

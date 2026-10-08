import React from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#07080c] border-t border-purple-500/15 text-zinc-400 text-sm mt-20">
      {/* Top Value Strip */}
      <div className="border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">Free Express Delivery</h4>
              <p className="text-[11px] text-zinc-500">Across all major cities</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">100% Genuine Laptops</h4>
              <p className="text-[11px] text-zinc-500">Brand authorized warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">7-Day Hassle-Free Returns</h4>
              <p className="text-[11px] text-zinc-500">Peace of mind guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white">AI-Powered Shopping</h4>
              <p className="text-[11px] text-zinc-500">Personalized smart suggestions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 to-indigo-500 p-0.5">
                <div className="w-full h-full bg-[#0a0b10] rounded-[10px] flex items-center justify-center">
                  <Laptop className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                TECH<span className="text-purple-400">NOVA</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              TechNova is India's premier destination for high-performance laptops. From flagship gaming beasts and AI workstations to featherweight ultrabooks, find your ideal machine with tailored advice from our AI shopping assistant.
            </p>
            <div className="pt-2 text-xs text-zinc-400 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                <span>TechNova Towers, Outer Ring Road, Bengaluru, KA 560103</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400 shrink-0" />
                <span>+91 (800) 420-NOVA / +91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>support@technova.com</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider text-xs">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/laptops" className="hover:text-purple-300 transition">
                  All Laptops
                </Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-purple-300 transition">
                  Shop by Brand
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-purple-300 transition">
                  Exclusive Deals & Offers
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-purple-300 transition">
                  My Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-purple-300 transition">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-purple-400 transition text-purple-400 font-medium">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider text-xs">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/laptops?category=Gaming" className="hover:text-purple-300 transition">
                  Gaming Laptops
                </Link>
              </li>
              <li>
                <Link to="/laptops?category=Coding" className="hover:text-purple-300 transition">
                  Coding & AI Laptops
                </Link>
              </li>
              <li>
                <Link to="/laptops?category=Ultrabook" className="hover:text-purple-300 transition">
                  Ultrabooks & Thin-Light
                </Link>
              </li>
              <li>
                <Link to="/laptops?category=Creator" className="hover:text-purple-300 transition">
                  Creator & Studio
                </Link>
              </li>
              <li>
                <Link to="/laptops?category=Business" className="hover:text-purple-300 transition">
                  Business & Executive
                </Link>
              </li>
              <li>
                <Link to="/laptops?category=Student" className="hover:text-purple-300 transition">
                  Student & Everyday
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Policies */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider text-xs">
              Support & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-purple-300 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-300 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-purple-300 transition">
                  Warranty & Servicing
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-purple-300 transition">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-purple-300 transition">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-purple-300 transition">
                  Refund & Cancellation
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} TechNova Inc. All rights reserved. Premium Laptop E-Commerce & AI Assistant.</p>
          <div className="flex items-center space-x-6 text-zinc-400">
            <span className="hover:text-purple-400 cursor-pointer">Twitter / X</span>
            <span className="hover:text-purple-400 cursor-pointer">Instagram</span>
            <span className="hover:text-purple-400 cursor-pointer">YouTube</span>
            <span className="hover:text-purple-400 cursor-pointer">LinkedIn</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

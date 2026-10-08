import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, ArrowRight, User, MapPin, ShoppingBag } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, totalItems, subtotal, deliveryFee, discountTotal, finalTotal } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name,
        email: prev.email || user.email,
        mobile: prev.mobile || user.mobile,
        street: prev.street || user.address?.street || '',
        city: prev.city || user.address?.city || '',
        state: prev.state || user.address?.state || '',
        pincode: prev.pincode || user.address?.pincode || '',
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.name.trim()) err.name = 'Full Name is required';
    if (!formData.email.trim()) {
      err.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = 'Valid email is required';
    }
    if (!formData.mobile.trim()) {
      err.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      err.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.street.trim()) err.street = 'Street Address is required';
    if (!formData.city.trim()) err.city = 'City is required';
    if (!formData.state.trim()) err.state = 'State is required';
    if (!formData.pincode.trim()) {
      err.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      err.pincode = 'Enter a valid 6-digit Pincode';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in customer details and delivery address.', 'error');
      return;
    }

    // Save checkout draft data in session
    sessionStorage.setItem('technova_checkout_data', JSON.stringify(formData));
    navigate('/payment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Checkout & Delivery
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Provide your delivery details to proceed to secure payment
        </p>
      </div>

      <form onSubmit={handleContinue} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* CUSTOMER & SHIPPING FORM */}
        <div className="lg:col-span-7 space-y-8">
          {/* SECTION 1: CUSTOMER DETAILS */}
          <div className="p-6 rounded-2xl bg-[#11131c] border border-zinc-800 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-white font-bold text-sm">
              <User className="w-4 h-4 text-purple-400" />
              <span>1. Customer Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Full Name <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Vivek Sharma"
                  className={`w-full bg-[#161826] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                    errors.name ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Email Address <span className="text-purple-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full bg-[#161826] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                    errors.email ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Mobile Number <span className="text-purple-400">*</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={`w-full bg-[#161826] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                    errors.mobile ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                  }`}
                />
                {errors.mobile && <p className="text-[11px] text-rose-400 mt-1">{errors.mobile}</p>}
              </div>
            </div>
          </div>

          {/* SECTION 2: DELIVERY ADDRESS */}
          <div className="p-6 rounded-2xl bg-[#11131c] border border-zinc-800 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-white font-bold text-sm">
              <MapPin className="w-4 h-4 text-purple-400" />
              <span>2. Delivery Address</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Street Address / Flat / Building <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="House/Flat No., Apartment, Street, Landmark"
                  className={`w-full bg-[#161826] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                    errors.street ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                  }`}
                />
                {errors.street && <p className="text-[11px] text-rose-400 mt-1">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    City <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bengaluru"
                    className={`w-full bg-[#161826] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                      errors.city ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                    }`}
                  />
                  {errors.city && <p className="text-[11px] text-rose-400 mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    State <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Karnataka"
                    className={`w-full bg-[#161826] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                      errors.state ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                    }`}
                  />
                  {errors.state && <p className="text-[11px] text-rose-400 mt-1">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Pincode <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6 digits"
                    maxLength={6}
                    className={`w-full bg-[#161826] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                      errors.pincode ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                    }`}
                  />
                  {errors.pincode && <p className="text-[11px] text-rose-400 mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER REVIEW & SUMMARY */}
        <div className="lg:col-span-5 bg-[#11131c] border border-zinc-800 rounded-2xl p-6 sticky top-28 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Order Items ({totalItems})</span>
            </h3>
            <Link to="/cart" className="text-xs text-purple-400 hover:text-purple-300">
              Edit Cart
            </Link>
          </div>

          {/* Items breakdown with color badges */}
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-zinc-800/60">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.selectedColor.sku}`}
                className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.selectedColor.image || item.product.images[0]}
                    alt={item.product.name}
                    className="w-10 h-10 object-contain bg-[#161824] rounded-lg p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{item.product.name}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <span>Color: {item.selectedColor.name}</span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-white">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cost breakdown */}
          <div className="pt-4 border-t border-zinc-800 space-y-2.5 text-xs sm:text-sm text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-400">Subtotal</span>
              <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discounts Applied</span>
                <span className="font-semibold">-₹{discountTotal.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-zinc-400">Delivery Fee</span>
              {deliveryFee === 0 ? (
                <span className="font-bold text-emerald-400 uppercase text-xs">FREE</span>
              ) : (
                <span className="font-semibold text-white">₹{deliveryFee.toLocaleString('en-IN')}</span>
              )}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
              <span className="text-base font-bold text-white">Final Total</span>
              <span className="text-xl font-black text-purple-400">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full purple-gradient-btn py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xl shadow-purple-900/60 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition duration-200"
          >
            <span>Continue to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            No real payments processed — fully functional simulation
          </p>
        </div>
      </form>
    </div>
  );
};

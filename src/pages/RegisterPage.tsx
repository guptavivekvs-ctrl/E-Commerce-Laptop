import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
    if (!formData.name.trim()) err.name = 'Full name is required';
    if (!formData.email.trim()) {
      err.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = 'Please provide a valid email address';
    }
    if (!formData.mobile.trim()) {
      err.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      err.mobile = 'Enter a valid 10-digit mobile number';
    }
    if (!formData.password) {
      err.password = 'Password is required';
    } else if (formData.password.length < 6) {
      err.password = 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = 'Passwords do not match';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.mobile, formData.password, 'customer');
      showToast('Account registered successfully! Welcome to TechNova.', 'success');
      navigate('/profile');
    } catch (err: any) {
      setErrors({ form: err.message || 'Registration failed' });
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-8 rounded-3xl bg-[#11131c] border border-purple-500/25 shadow-2xl shadow-purple-950/40">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-500 p-0.5 mx-auto mb-3 shadow-lg shadow-purple-900/40">
            <div className="w-full h-full bg-[#11131c] rounded-[14px] flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Create TechNova Account
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Join TechNova to unlock member pricing and AI laptop recommendations
          </p>
        </div>

        {errors.form && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Vivek Sharma"
                className={`w-full bg-[#161826] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                  errors.name ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`w-full bg-[#161826] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                  errors.email ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Mobile Number</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit number"
                maxLength={10}
                className={`w-full bg-[#161826] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                  errors.mobile ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.mobile && <p className="text-[11px] text-rose-400 mt-1">{errors.mobile}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className={`w-full bg-[#161826] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                  errors.password ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.password && <p className="text-[11px] text-rose-400 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className={`w-full bg-[#161826] border rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition ${
                  errors.confirmPassword ? 'border-rose-500' : 'border-zinc-700/80 focus:border-purple-500'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full purple-gradient-btn py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          Already registered?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

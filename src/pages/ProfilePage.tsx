import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  Package,
  LogOut,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user, isAdmin, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passData, setPassData] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <User className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Sign in to view your profile</h2>
        <p className="text-xs text-zinc-400 mb-6">Manage your orders and saved shipping addresses.</p>
        <Link to="/login" className="purple-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white">
          Sign In
        </Link>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: formData.name,
        mobile: formData.mobile,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      });
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPass.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (passData.newPass !== passData.confirmPass) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    setPasswordModalOpen(false);
    setPassData({ oldPass: '', newPass: '', confirmPass: '' });
    showToast('Password updated successfully.', 'success');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Account
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage your personal profile, credentials, and default shipping addresses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-2 transition"
          >
            <Package className="w-4 h-4 text-purple-400" />
            <span>My Orders</span>
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 text-xs font-semibold border border-rose-500/30 flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* LEFT PROFILE CARD */}
        <div className="md:col-span-4 bg-[#11131c] border border-zinc-800 rounded-3xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-violet-400 flex items-center justify-center text-white text-2xl font-black mx-auto shadow-lg shadow-purple-900/50 uppercase">
            {user.name.charAt(0)}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">{user.name}</h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{user.email}</p>
          </div>

          <div className="pt-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isAdmin
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-500/40'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
              }`}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>TechNova Admin</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Customer Account</span>
                </>
              )}
            </span>
          </div>

          {isAdmin && (
            <div className="pt-3 border-t border-zinc-800">
              <Link
                to="/admin"
                className="w-full purple-gradient-btn py-2 px-3 rounded-xl text-xs font-bold text-white inline-flex items-center justify-center gap-2 shadow-md shadow-purple-900/40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Go to Admin Dashboard</span>
              </Link>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => setPasswordModalOpen(true)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1.5 mx-auto font-medium"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
          </div>
        </div>

        {/* RIGHT PROFILE DETAILS & EDIT FORM */}
        <div className="md:col-span-8 bg-[#11131c] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
            <h3 className="text-base font-bold text-white">Profile & Delivery Info</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white disabled:opacity-60 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    disabled={!isEditing}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-white disabled:opacity-60 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Email Address (Permanent)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-[#161826] border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-zinc-400 opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* SHIPPING ADDRESS */}
            <div className="pt-4 border-t border-zinc-800 space-y-4">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Default Shipping Address</span>
              </h4>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Street / Apartment
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.street}
                  placeholder={isEditing ? 'Enter street address' : 'Not configured'}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white disabled:opacity-60 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">City</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.city}
                    placeholder={isEditing ? 'City' : '—'}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white disabled:opacity-60 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">State</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.state}
                    placeholder={isEditing ? 'State' : '—'}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white disabled:opacity-60 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Pincode</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.pincode}
                    placeholder={isEditing ? 'Pincode' : '—'}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full bg-[#161826] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white disabled:opacity-60 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="purple-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-purple-900/50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12141f] border border-purple-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-white">Change Account Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passData.newPass}
                  onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                  placeholder="Min 6 characters"
                  className="w-full bg-[#181a26] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={passData.confirmPass}
                  onChange={(e) => setPassData({ ...passData, confirmPass: e.target.value })}
                  placeholder="Repeat new password"
                  className="w-full bg-[#181a26] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="purple-gradient-btn px-4 py-2 rounded-xl text-xs font-bold text-white"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

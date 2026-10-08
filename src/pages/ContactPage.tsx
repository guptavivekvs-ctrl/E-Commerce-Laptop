import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your message has been sent to TechNova customer support!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
          We're Here to Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact TechNova Support
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Have questions regarding an order, technical specifications, bulk institutional purchases, or warranty support? Get in touch with our specialist team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* CONTACT INFO TILES */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#11131c] border border-zinc-800 space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Corporate Headquarters</h3>

            <div className="flex items-start gap-3.5 text-xs text-zinc-300">
              <MapPin className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">TechNova Towers</p>
                <p className="text-zinc-400">Outer Ring Road, Bellandur, Bengaluru, Karnataka 560103, India</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs text-zinc-300">
              <Phone className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Telephone Support</p>
                <p className="text-zinc-400">+91 (800) 420-NOVA / +91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs text-zinc-300">
              <Mail className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Email Inquiries</p>
                <p className="text-zinc-400">support@technova.com / sales@technova.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs text-zinc-300">
              <Clock className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <p className="font-semibold text-white">Operating Hours</p>
                <p className="text-zinc-400">Monday – Saturday: 9:00 AM – 8:00 PM IST</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-white">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Instant AI Assistance</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Need immediate answers about RAM upgrades, GPU benchmarks, or budget matching? TechNova AI is active 24/7 in the bottom-right corner of your screen.
            </p>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="lg:col-span-7 bg-[#11131c] border border-zinc-800 rounded-3xl p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Thank You for Reaching Out!</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto">
                Your ticket has been logged with reference #TN-TKT-{Math.floor(1000 + Math.random() * 9000)}. Our support engineer will respond within 4 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="purple-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Send a Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vivek Sharma"
                    className="w-full bg-[#161826] border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#161826] border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Inquiring about HP OMEN availability or Warranty claim"
                  className="w-full bg-[#161826] border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry or order details..."
                  className="w-full bg-[#161826] border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="purple-gradient-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2 transition"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

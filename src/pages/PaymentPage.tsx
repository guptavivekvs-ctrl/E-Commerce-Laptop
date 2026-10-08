import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  QrCode,
  Truck,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Loader2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { StorageService } from '../services/storageService';
import { Order, PaymentMethod } from '../types';

export const PaymentPage: React.FC = () => {
  const { items, subtotal, deliveryFee, discountTotal, finalTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [processing, setProcessing] = useState(false);

  // Form Fields
  const [upiId, setUpiId] = useState('techuser@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardName, setCardName] = useState(user?.name || 'Vivek Sharma');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('321');

  // Customer Data loaded from checkout step
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('technova_checkout_data');
    if (!saved || items.length === 0) {
      navigate('/cart');
      return;
    }
    setCustomerData(JSON.parse(saved));
  }, [items, navigate]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerData) return;

    setProcessing(true);

    // Simulate 1.5s network processing for authentic experience
    setTimeout(async () => {
      try {
        const orderId = 'TN-' + Math.floor(100000 + Math.random() * 900000);

        const newOrder: Order = {
          id: orderId,
          userId: user?.id || 'guest-' + Date.now(),
          customer: {
            name: customerData.name,
            email: customerData.email,
            mobile: customerData.mobile,
          },
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.product.name,
            brand: i.product.brand,
            colorName: i.selectedColor.name,
            colorHex: i.selectedColor.hex,
            colorSku: i.selectedColor.sku,
            image: i.selectedColor.image || i.product.images[0],
            price: i.product.price,
            quantity: i.quantity,
            subtotal: i.product.price * i.quantity,
          })),
          subtotal,
          discount: discountTotal,
          deliveryFee,
          total: finalTotal,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
          orderStatus: 'Order Placed',
          deliveryAddress: {
            street: customerData.street,
            city: customerData.city,
            state: customerData.state,
            pincode: customerData.pincode,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // 1. Create Order in Database
        await StorageService.createOrder(newOrder);

        // 2. Reduce Stock of the specific color variation & product
        await StorageService.reduceStock(
          items.map((i) => ({
            productId: i.productId,
            colorSku: i.selectedColor.sku,
            quantity: i.quantity,
          }))
        );

        // 3. Clear cart
        clearCart();
        sessionStorage.removeItem('technova_checkout_data');

        showToast(`Order #${orderId} placed successfully!`, 'success');
        navigate(`/order-success/${orderId}`);
      } catch (err) {
        console.error('Error placing order:', err);
        showToast('Failed to complete order. Please try again.', 'error');
        setProcessing(false);
      }
    }, 1500);
  };

  if (!customerData) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* MANDATORY PROMINENT DEMO NOTICE */}
      <div className="mb-8 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-3 text-amber-200 text-xs sm:text-sm">
        <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0" />
        <div>
          <p className="font-bold">Demo Payment Gateway</p>
          <p className="text-amber-300/80 text-xs">
            Demo Payment – No real money will be charged. This simulates an authentic order placement flow, reduces stock, and updates database history.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* PAYMENT METHOD CHOICES */}
        <div className="md:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#11131c] border border-zinc-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Select Payment Method</span>
            </h2>

            {/* TAB SELECTORS */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#161826] rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-2.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'UPI'
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4 text-purple-400" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`py-2.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'Card'
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`py-2.5 px-2 rounded-lg text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                  paymentMethod === 'COD'
                    ? 'bg-purple-900/60 text-purple-200 border border-purple-500/40 shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* UPI DETAILS */}
            {paymentMethod === 'UPI' && (
              <div className="pt-2 space-y-4">
                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-300 flex items-center justify-between">
                  <span>Fast UPI Transfer (GPay, PhonePe, Paytm)</span>
                  <span className="font-bold text-emerald-400 text-[11px]">Instant Verified</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">UPI ID / VPA</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                    className="w-full bg-[#161826] border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">Pre-filled with demo UPI identifier</p>
                </div>
              </div>
            )}

            {/* CARD DETAILS */}
            {paymentMethod === 'Card' && (
              <div className="pt-2 space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#161826] border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-[#161826] border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-[#161826] border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full bg-[#161826] border border-zinc-700/80 focus:border-purple-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COD DETAILS */}
            {paymentMethod === 'COD' && (
              <div className="pt-2 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                <p className="font-semibold text-white">Cash on Delivery Available</p>
                <p className="text-zinc-400">
                  You can pay in cash or via QR code upon delivery. OTP verification will be required at the time of doorstep handover.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ORDER FINAL CONFIRMATION */}
        <div className="md:col-span-5 bg-[#11131c] border border-zinc-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-base font-bold text-white pb-3 border-b border-zinc-800">
            Payment Summary
          </h3>

          <div className="space-y-2.5 text-xs text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-400">Deliver To:</span>
              <span className="font-semibold text-white truncate max-w-[150px]">
                {customerData.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Delivery City:</span>
              <span className="font-semibold text-white">
                {customerData.city}, {customerData.pincode}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Total Items:</span>
              <span className="font-semibold text-white">{items.length} Laptop(s)</span>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Amount Payable</span>
              <span className="text-2xl font-black text-purple-400">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={processing}
            className="w-full purple-gradient-btn py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-xl shadow-purple-900/60 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Simulating Payment & Creating Order...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay ₹{finalTotal.toLocaleString('en-IN')} & Place Order</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 text-center">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Encrypted Demo Transaction Session</span>
          </div>
        </div>
      </div>
    </div>
  );
};

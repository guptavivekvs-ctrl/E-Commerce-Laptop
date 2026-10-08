import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { QuickSearchModal } from './components/common/QuickSearchModal';
import { AIChatbotModal } from './components/chatbot/AIChatbotModal';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { LaptopsPage } from './pages/LaptopsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { BrandsPage } from './pages/BrandsPage';
import { OffersPage } from './pages/OffersPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages & Layout
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminBrandsPage } from './pages/admin/AdminBrandsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Customer Storefront Layout Wrapper
const StorefrontLayout: React.FC<{
  onOpenSearch: () => void;
  onOpenChatbot: () => void;
}> = ({ onOpenSearch, onOpenChatbot }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#090a0f] text-zinc-100">
      <Navbar onOpenSearch={onOpenSearch} onOpenChatbot={onOpenChatbot} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />

            {/* GLOBAL SEARCH MODAL */}
            <QuickSearchModal
              isOpen={isSearchOpen}
              onClose={() => setIsSearchOpen(false)}
              onOpenChatbot={() => {
                setIsSearchOpen(false);
                setIsChatbotOpen(true);
              }}
            />

            {/* FLOATING AI CHATBOT (Visible across storefront) */}
            <AIChatbotModal
              isOpen={isChatbotOpen}
              onClose={() => setIsChatbotOpen(false)}
              onOpen={() => setIsChatbotOpen(true)}
            />

            <Routes>
              {/* STOREFRONT ROUTES */}
              <Route
                element={
                  <StorefrontLayout
                    onOpenSearch={() => setIsSearchOpen(true)}
                    onOpenChatbot={() => setIsChatbotOpen(true)}
                  />
                }
              >
                <Route path="/" element={<HomePage onOpenChatbot={() => setIsChatbotOpen(true)} />} />
                <Route path="/laptops" element={<LaptopsPage />} />
                <Route path="/laptops/:id" element={<ProductDetailPage />} />
                <Route path="/search" element={<LaptopsPage />} />
                <Route path="/brands" element={<BrandsPage />} />
                <Route path="/offers" element={<OffersPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* AUTH & PROFILE */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* CART, CHECKOUT & ORDERS */}
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
              </Route>

              {/* ADMIN LOGIN */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* PROTECTED ADMIN CONSOLE */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="products/add" element={<AdminProductFormPage />} />
                <Route path="products/edit/:id" element={<AdminProductFormPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="brands" element={<AdminBrandsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;

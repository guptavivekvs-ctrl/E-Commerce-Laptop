# TechNova — Premium Laptop E-Commerce & AI Shopping Chatbot

TechNova is an ultra-modern, production-grade laptop e-commerce web application featuring real-time catalog filtering, dynamic color variation image switching, authentic cart & checkout simulation, order tracking, role-based admin console, and an integrated AI shopping assistant powered by Google Gemini.

---

## 🚀 Live Demo & Quick Start

The application dev server is live at:
**[http://localhost:5173/](http://localhost:5173/)**

### Default Accounts for Instant Testing:
| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@technova.com` | `admin123` | Full Admin Console (`/admin`), Product CRUD, Color Variations, Orders, Users, Brands & Categories |
| **Customer** | `user@technova.com` | `user123` | Store Front, Cart, Checkout, Demo Payments, My Orders, Profile |
| **New Users** | *Self Register* | *Any 6+ chars* | Full account registration with Firestore sync |

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Modern Tailwind CSS v4 with dark charcoal/purple glowing glassmorphism aesthetic
- **Icons:** Lucide React
- **Animations & FX:** Canvas-Confetti, Tailwind transitions
- **Database & Storage:** Firebase Cloud Firestore & Firebase Auth (with transparent persistent local fallback for 100% zero-configuration out-of-the-box readiness)
- **AI Shopping Assistant:** Google Gemini 1.5 Flash via `@google/generative-ai` with intelligent catalog-aware recommendation engine fallback

---

## 🌟 Key Features Implemented

### 1. Storefront & Home Experience
- **Hero Section:** Dark charcoal/purple design with glowing ambient effects, bold typography, flagship product highlights, and direct CTAs.
- **Features Banner:** Guarantees Fast Delivery, Secure Checkout, 100% Genuine Products, Easy Returns, and Warranty Support.
- **Popular Brands Showcase:** HP, Dell, Lenovo, ASUS, Acer, Apple, and Microsoft.
- **Featured Laptops:** Live cards with pricing, processor, RAM, ratings, and instant purchase.
- **Limited-Time Offers:** Highlighted deals and discounts up to ₹35,000.
- **AI Chatbot Promotion Banner:** Encouraging shoppers to ask for customized laptop guidance.
- **Comprehensive Footer:** Company story, legal links, customer support, and social icons.

### 2. Shop & Catalog Filtering (`/laptops`)
- Real-time multi-dimensional filter bar:
  - **Search:** Search across laptop name, brand, category, processor, RAM, and graphics.
  - **Brand Filter:** HP, Dell, Lenovo, ASUS, Acer, Apple, Microsoft.
  - **Category Filter:** Gaming, Ultrabook, Creator & Studio, Coding & AI/ML, Business, Student.
  - **Price Range Slider:** Up to ₹3,50,000 with real-time feedback.
  - **Hardware Filters:** Memory (8GB, 16GB, 32GB, 36GB), Processor family (Intel, AMD, Apple Silicon, Snapdragon), Storage, and Graphics (NVIDIA RTX, Arc, etc.).
  - **Sorting:** Popularity, Price (Low to High), Price (High to Low), Newest.

### 3. Product Details with Dynamic Color Variations (`/laptops/:id`)
- **Large Product Gallery:** Main visual + thumbnail strip.
- **Color Variation Switching:**
  - Selecting different colors (e.g., Space Black, Glacier Silver, Eclipse Gray) **immediately updates the preview image**, SKU, and stock count.
  - Selected color is preserved in the cart, checkout, payment, order receipt, and admin management.
- **Quantity Selector:** Clamped strictly to available variation stock.
- **Detailed Specifications:** Structured table for Processor, RAM, Storage, GPU, Display, and OS.
- **Related Laptops Carousel:** Automatically recommends similar category or brand machines.

### 4. Cart, Checkout & Demo Payment Flow
- **Shopping Cart (`/cart`):**
  - Displays selected color swatch, SKU, quantity controls, unit price, subtotal, and stock limit alerts.
  - Persistent storage for authenticated users with automatic guest cart merge on login.
- **Checkout Page (`/checkout`):**
  - Validates customer name, email, 10-digit mobile number, street address, city, state, and 6-digit pincode.
- **Demo Payment (`/payment`):**
  - Clearly labeled: *"Demo Payment – No real money will be charged."*
  - Supports UPI (GPay/PhonePe ID), Credit/Debit Cards, and Cash on Delivery.
  - Simulates payment confirmation, **reduces live stock of the selected color variation**, creates an order in Firestore/database, and clears the cart.
- **Order Confirmation (`/order-success/:id`):**
  - Celebratory confetti burst.
  - Full receipt showing Order ID, items with color swatches, address, and status.

### 5. My Orders & Profile
- **My Orders (`/orders`):** History of all purchases with live status badges.
- **Order Tracking (`/orders/:id`):** Visual 5-step journey tracker (*Order Placed* → *Processing* → *Shipped* → *Out for Delivery* → *Delivered*).
- **Profile (`/profile`):** Edit personal info, update default shipping address, and change password.

### 6. Floating AI Shopping Chatbot (TechNova AI)
- Floating button with purple aura visible across all storefront pages.
- Understands natural language queries:
  - Budget constraints (e.g., *"Suggest a laptop under ₹70,000 for coding"*).
  - Use-cases (*"Best gaming laptop"*, *"Laptop for AI/ML"*, *"Best student laptop"*, *"Video editing"*).
  - Hardware comparisons (*"Compare HP OMEN and Dell XPS"*).
- Recommends actual laptops from the TechNova live inventory with price, specs, and **interactive cards with direct "View" and "Add to Cart" buttons**.
- Quick prompt pills for one-click questions.

### 7. Protected Admin Console (`/admin`)
- **Security:** Protected routes ensuring only users with `role: 'admin'` can enter.
- **Admin Dashboard (`/admin`):** Total Products, Total Users, Total Orders, Total Revenue, Low Stock Alerts, and recent order stream.
- **Product Management (`/admin/products`):**
  - Add & Edit products with full specifications.
  - **Color Variation Management:** Add colors, delete colors, set hex, upload image URL, set SKU, and set color stock.
  - Delete product with confirmation modal.
- **Order Fulfillment (`/admin/orders`):**
  - Inspect customer information, delivery address, ordered colors, and quantities.
  - Change status (*Order Placed* → *Processing* → *Shipped* → *Out for Delivery* → *Delivered* → *Cancelled*).
  - Status changes reflect **immediately** in the customer's *My Orders* page!
- **User Management (`/admin/users`):** View all customers, inspection modal, order counts, and toggle admin privileges.
- **Brand & Category Taxonomy (`/admin/brands`, `/admin/categories`):** Add, edit, and delete partner brands and categories dynamically.
- **API & Integrations (`/admin/settings`):** Live telemetry for Firebase Cloud and Gemini API, environment variable guide, and factory reset button.

---

## ⚙️ Environment Variables Configuration

To connect live Firebase cloud services and your Gemini API key, configure `.env` in `technova-store`:

```env
# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Web Credentials
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Firestore security rules are provided in `technova-store/firestore.rules`.

---

## 🏃 Running the Application

To run the application manually:
```powershell
cd technova-store
npm run dev
```

To build for production:
```powershell
npm run build
npm run preview
```

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product, ProductColorVariation } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  discountTotal: number;
  finalTotal: number;
  addToCart: (product: Product, color: ProductColorVariation, quantity?: number) => void;
  updateQuantity: (productId: string, colorSku: string, newQty: number) => void;
  removeFromCart: (productId: string, colorSku: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = 'technova_guest_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const getStorageKey = () => (user ? `technova_user_cart_${user.id}` : GUEST_CART_KEY);

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const key = user ? `technova_user_cart_${user.id}` : GUEST_CART_KEY;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // When user logs in, merge guest cart into user's cart
  useEffect(() => {
    if (user) {
      const userKey = `technova_user_cart_${user.id}`;
      const savedUserCart = localStorage.getItem(userKey);
      let parsedUserCart: CartItem[] = savedUserCart ? JSON.parse(savedUserCart) : [];

      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      if (guestCart) {
        try {
          const guestItems: CartItem[] = JSON.parse(guestCart);
          if (guestItems.length > 0) {
            // Merge items
            guestItems.forEach((gItem) => {
              const existingIdx = parsedUserCart.findIndex(
                (i) => i.productId === gItem.productId && i.selectedColor.sku === gItem.selectedColor.sku
              );
              if (existingIdx >= 0) {
                const maxStock = gItem.selectedColor.stock || 10;
                parsedUserCart[existingIdx].quantity = Math.min(
                  maxStock,
                  parsedUserCart[existingIdx].quantity + gItem.quantity
                );
              } else {
                parsedUserCart.push(gItem);
              }
            });
            localStorage.removeItem(GUEST_CART_KEY);
            showToast('Guest cart merged into your account!', 'info');
          }
        } catch (e) {
          console.error(e);
        }
      }
      setItems(parsedUserCart);
      localStorage.setItem(userKey, JSON.stringify(parsedUserCart));
    } else {
      // Guest mode
      try {
        const guestSaved = localStorage.getItem(GUEST_CART_KEY);
        setItems(guestSaved ? JSON.parse(guestSaved) : []);
      } catch {
        setItems([]);
      }
    }
  }, [user]);

  // Persist whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items, user]);

  const addToCart = (product: Product, color: ProductColorVariation, quantity = 1) => {
    if (color.stock <= 0) {
      showToast(`${product.name} in ${color.name} is currently out of stock.`, 'error');
      return;
    }

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === product.id && i.selectedColor.sku === color.sku
      );

      if (existingIdx >= 0) {
        const currentQty = prev[existingIdx].quantity;
        const newQty = Math.min(color.stock, currentQty + quantity);
        if (currentQty >= color.stock) {
          showToast(`Maximum available stock (${color.stock}) already in cart.`, 'info');
          return prev;
        }
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], quantity: newQty };
        showToast(`Updated quantity for ${product.name} (${color.name})`, 'success');
        return updated;
      } else {
        const initialQty = Math.min(color.stock, quantity);
        showToast(`Added ${product.name} (${color.name}) to cart!`, 'success');
        return [...prev, { productId: product.id, product, selectedColor: color, quantity: initialQty }];
      }
    });
  };

  const updateQuantity = (productId: string, colorSku: string, newQty: number) => {
    setItems((prev) => {
      return prev.map((item) => {
        if (item.productId === productId && item.selectedColor.sku === colorSku) {
          const maxStock = item.selectedColor.stock;
          const clamped = Math.max(1, Math.min(maxStock, newQty));
          if (newQty > maxStock) {
            showToast(`Only ${maxStock} units available in stock.`, 'info');
          }
          return { ...item, quantity: clamped };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId: string, colorSku: string) => {
    setItems((prev) => {
      const removed = prev.find((i) => i.productId === productId && i.selectedColor.sku === colorSku);
      if (removed) {
        showToast(`Removed ${removed.product.name} (${removed.selectedColor.name}) from cart.`, 'info');
      }
      return prev.filter((i) => !(i.productId === productId && i.selectedColor.sku === colorSku));
    });
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(getStorageKey());
    } catch (e) {
      console.error(e);
    }
  };

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  // TechNova free shipping on orders above ₹50,000, else ₹499
  const deliveryFee = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal > 50000 ? 0 : 499;
  }, [subtotal, items]);

  const discountTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const orig = item.product.originalPrice || item.product.price;
      const diff = Math.max(0, orig - item.product.price);
      return sum + diff * item.quantity;
    }, 0);
  }, [items]);

  const finalTotal = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        deliveryFee,
        discountTotal,
        finalTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

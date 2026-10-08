import { Product, Order, UserProfile, Brand, Category, OrderStatus } from '../types';
import { initialProducts } from '../data/initialProducts';
import { initialBrands } from '../data/initialBrands';
import { initialCategories } from '../data/initialCategories';
import { db, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

const STORAGE_KEYS = {
  PRODUCTS: 'technova_products',
  ORDERS: 'technova_orders',
  USERS: 'technova_users',
  BRANDS: 'technova_brands',
  CATEGORIES: 'technova_categories',
};

// Initial Seed Users for Demo
const initialUsers: UserProfile[] = [
  {
    id: 'admin-01',
    name: 'Admin Vivek',
    email: 'admin@technova.com',
    mobile: '9876543210',
    role: 'admin',
    createdAt: '2026-01-01T00:00:00Z',
    address: {
      street: '42 Cyber Towers, Tech Zone 4',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560100',
    },
  },
  {
    id: 'customer-01',
    name: 'Alex Johnson',
    email: 'user@technova.com',
    mobile: '9123456789',
    role: 'customer',
    createdAt: '2026-02-15T00:00:00Z',
    address: {
      street: 'Flat 402, Green Glen Apartments',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411028',
    },
  },
];

// Initial Seed Orders
const initialOrders: Order[] = [
  {
    id: 'TN-984210',
    userId: 'customer-01',
    customer: {
      name: 'Alex Johnson',
      email: 'user@technova.com',
      mobile: '9123456789',
    },
    items: [
      {
        productId: 'acer-swift-go-14-oled',
        productName: 'Acer Swift Go 14 Intel Core Ultra 5 OLED',
        brand: 'Acer',
        colorName: 'Pure Silver',
        colorHex: '#e2e8f0',
        colorSku: 'ACR-SWF14-SLV-01',
        image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80',
        price: 67990,
        quantity: 1,
        subtotal: 67990,
      },
    ],
    subtotal: 67990,
    discount: 0,
    deliveryFee: 0,
    total: 67990,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    deliveryAddress: {
      street: 'Flat 402, Green Glen Apartments',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411028',
    },
    createdAt: '2026-03-01T14:20:00Z',
    updatedAt: '2026-03-02T10:00:00Z',
  },
];

// Local storage helpers
function readLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch {
    return defaultVal;
  }
}

function writeLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Failed to write local storage', e);
  }
}

// Reactive store event dispatchers
const listeners: Array<() => void> = [];
export function subscribeToStoreChanges(callback: () => void): () => void {
  listeners.push(callback);
  return () => {
    const idx = listeners.indexOf(callback);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}
function notifySubscribers() {
  listeners.forEach((fn) => fn());
}

export class StorageService {
  // PRODUCTS
  static async getProducts(): Promise<Product[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (!querySnapshot.empty) {
          const remote: Product[] = [];
          querySnapshot.forEach((d) => remote.push({ id: d.id, ...d.data() } as Product));
          return remote;
        }
      } catch (err) {
        console.warn('Error fetching products from Firestore, using local cache', err);
      }
    }
    return readLocal<Product[]>(STORAGE_KEYS.PRODUCTS, initialProducts);
  }

  static async getProductById(id: string): Promise<Product | null> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Product;
        }
      } catch (e) {
        console.warn('Error fetching product doc from Firestore', e);
      }
    }
    const products = await this.getProducts();
    return products.find((p) => p.id === id) || null;
  }

  static async saveProduct(product: Product): Promise<void> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    let updated: Product[];

    if (index >= 0) {
      updated = [...products];
      updated[index] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      updated = [
        {
          ...product,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        ...products,
      ];
    }

    writeLocal(STORAGE_KEYS.PRODUCTS, updated);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'products', product.id), product);
      } catch (e) {
        console.warn('Error saving product to Firestore', e);
      }
    }
    notifySubscribers();
  }

  static async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const updated = products.filter((p) => p.id !== id);
    writeLocal(STORAGE_KEYS.PRODUCTS, updated);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (e) {
        console.warn('Error deleting product from Firestore', e);
      }
    }
    notifySubscribers();
  }

  // Stock reduction when order is placed
  static async reduceStock(items: { productId: string; colorSku: string; quantity: number }[]): Promise<void> {
    const products = await this.getProducts();
    let changed = false;

    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        // Reduce global product stock
        prod.stock = Math.max(0, prod.stock - item.quantity);
        // Reduce specific color variation stock
        if (prod.colors) {
          const variation = prod.colors.find((c) => c.sku === item.colorSku);
          if (variation) {
            variation.stock = Math.max(0, variation.stock - item.quantity);
          }
        }
        changed = true;
      }
    }

    if (changed) {
      writeLocal(STORAGE_KEYS.PRODUCTS, products);
      if (isFirebaseConfigured && db) {
        for (const item of items) {
          const prod = products.find((p) => p.id === item.productId);
          if (prod) {
            try {
              await setDoc(doc(db, 'products', prod.id), prod);
            } catch (e) {
              console.warn('Failed to update stock in Firestore', e);
            }
          }
        }
      }
      notifySubscribers();
    }
  }

  // ORDERS
  static async getOrders(): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        if (!querySnapshot.empty) {
          const remote: Order[] = [];
          querySnapshot.forEach((d) => remote.push({ id: d.id, ...d.data() } as Order));
          return remote.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      } catch (err) {
        console.warn('Error fetching orders from Firestore', err);
      }
    }
    const orders = readLocal<Order[]>(STORAGE_KEYS.ORDERS, initialOrders);
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static async getUserOrders(userId: string): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const remote: Order[] = [];
        querySnapshot.forEach((d) => remote.push({ id: d.id, ...d.data() } as Order));
        if (remote.length > 0) {
          return remote.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      } catch (e) {
        console.warn('Error querying user orders in Firestore', e);
      }
    }
    const all = await this.getOrders();
    return all.filter((o) => o.userId === userId);
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === orderId) || null;
  }

  static async createOrder(order: Order): Promise<void> {
    const orders = await this.getOrders();
    const updated = [order, ...orders];
    writeLocal(STORAGE_KEYS.ORDERS, updated);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', order.id), order);
      } catch (e) {
        console.warn('Error creating order in Firestore', e);
      }
    }
    notifySubscribers();
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orders = await this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.orderStatus = status;
      order.updatedAt = new Date().toISOString();
      writeLocal(STORAGE_KEYS.ORDERS, orders);

      if (isFirebaseConfigured && db) {
        try {
          await updateDoc(doc(db, 'orders', orderId), {
            orderStatus: status,
            updatedAt: order.updatedAt,
          });
        } catch (e) {
          console.warn('Error updating order status in Firestore', e);
        }
      }
      notifySubscribers();
    }
  }

  // USERS
  static async getUsers(): Promise<UserProfile[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        if (!querySnapshot.empty) {
          const remote: UserProfile[] = [];
          querySnapshot.forEach((d) => remote.push({ id: d.id, ...d.data() } as UserProfile));
          return remote;
        }
      } catch (e) {
        console.warn('Error fetching users from Firestore', e);
      }
    }
    return readLocal<UserProfile[]>(STORAGE_KEYS.USERS, initialUsers);
  }

  static async saveUser(user: UserProfile): Promise<void> {
    const users = await this.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    let updated: UserProfile[];
    if (idx >= 0) {
      updated = [...users];
      updated[idx] = user;
    } else {
      updated = [user, ...users];
    }
    writeLocal(STORAGE_KEYS.USERS, updated);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', user.id), user);
      } catch (e) {
        console.warn('Error saving user in Firestore', e);
      }
    }
    notifySubscribers();
  }

  // BRANDS
  static async getBrands(): Promise<Brand[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'brands'));
        if (!querySnapshot.empty) {
          const remote: Brand[] = [];
          querySnapshot.forEach((d) => remote.push({ id: d.id, ...d.data() } as Brand));
          return remote;
        }
      } catch (e) {
        console.warn('Error fetching brands', e);
      }
    }
    return readLocal<Brand[]>(STORAGE_KEYS.BRANDS, initialBrands);
  }

  static async saveBrand(brand: Brand): Promise<void> {
    const brands = await this.getBrands();
    const idx = brands.findIndex((b) => b.id === brand.id);
    let updated: Brand[];
    if (idx >= 0) {
      updated = [...brands];
      updated[idx] = brand;
    } else {
      updated = [...brands, brand];
    }
    writeLocal(STORAGE_KEYS.BRANDS, updated);
    notifySubscribers();
  }

  static async deleteBrand(id: string): Promise<void> {
    const brands = await this.getBrands();
    const updated = brands.filter((b) => b.id !== id);
    writeLocal(STORAGE_KEYS.BRANDS, updated);
    notifySubscribers();
  }

  // CATEGORIES
  static async getCategories(): Promise<Category[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        if (!querySnapshot.empty) {
          const remote: Category[] = [];
          querySnapshot.forEach((d) => remote.push({ id: d.id, ...d.data() } as Category));
          return remote;
        }
      } catch (e) {
        console.warn('Error fetching categories', e);
      }
    }
    return readLocal<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  }

  static async saveCategory(cat: Category): Promise<void> {
    const cats = await this.getCategories();
    const idx = cats.findIndex((c) => c.id === cat.id);
    let updated: Category[];
    if (idx >= 0) {
      updated = [...cats];
      updated[idx] = cat;
    } else {
      updated = [...cats, cat];
    }
    writeLocal(STORAGE_KEYS.CATEGORIES, updated);
    notifySubscribers();
  }

  static async deleteCategory(id: string): Promise<void> {
    const cats = await this.getCategories();
    const updated = cats.filter((c) => c.id !== id);
    writeLocal(STORAGE_KEYS.CATEGORIES, updated);
    notifySubscribers();
  }
}

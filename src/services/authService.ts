import { UserProfile, UserRole } from '../types';
import { auth, isFirebaseConfigured, db } from './firebase';
import { StorageService } from './storageService';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CURRENT_USER_KEY = 'technova_auth_user';

export class AuthService {
  static getStoredUser(): UserProfile | null {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  static setStoredUser(user: UserProfile | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  static async login(email: string, pass: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check real Firebase Auth if configured
    if (isFirebaseConfigured && auth && db) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
        const uid = userCred.user.uid;
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const profile = { id: uid, ...userDoc.data() } as UserProfile;
          this.setStoredUser(profile);
          return profile;
        }
      } catch (e) {
        console.warn('Firebase Auth failed, checking local credentials', e);
      }
    }

    // 2. Demo credentials check
    if (cleanEmail === 'admin@technova.com' && pass === 'admin123') {
      const adminProfile: UserProfile = {
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
      };
      this.setStoredUser(adminProfile);
      return adminProfile;
    }

    if (cleanEmail === 'user@technova.com' && pass === 'user123') {
      const customerProfile: UserProfile = {
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
      };
      this.setStoredUser(customerProfile);
      return customerProfile;
    }

    // 3. Check registered users in storage
    const allUsers = await StorageService.getUsers();
    const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      // In local mode password matches or is accepted if user exists
      this.setStoredUser(existing);
      return existing;
    }

    throw new Error('Invalid email or password. Use admin@technova.com / admin123 or register a new account.');
  }

  static async register(
    name: string,
    email: string,
    mobile: string,
    pass: string,
    role: UserRole = 'customer'
  ): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const allUsers = await StorageService.getUsers();
    if (allUsers.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists.');
    }

    let uid = 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    // Firebase Auth registration if configured
    if (isFirebaseConfigured && auth && db) {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
        uid = userCred.user.uid;
      } catch (e) {
        console.warn('Firebase createUser failed, continuing in persistent local store', e);
      }
    }

    const newUser: UserProfile = {
      id: uid,
      name: name.trim(),
      email: cleanEmail,
      mobile: mobile.trim(),
      role,
      createdAt: new Date().toISOString(),
      address: {
        street: '',
        city: '',
        state: '',
        pincode: '',
      },
    };

    await StorageService.saveUser(newUser);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', uid), newUser);
      } catch (e) {
        console.warn('Firestore setDoc failed for new user', e);
      }
    }

    this.setStoredUser(newUser);
    return newUser;
  }

  static async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn('Firebase signOut error', e);
      }
    }
    this.setStoredUser(null);
  }

  static async updateProfile(id: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const allUsers = await StorageService.getUsers();
    const user = allUsers.find((u) => u.id === id);
    if (!user) throw new Error('User not found');

    const updated: UserProfile = {
      ...user,
      ...updates,
    };

    await StorageService.saveUser(updated);
    this.setStoredUser(updated);
    return updated;
  }
}
